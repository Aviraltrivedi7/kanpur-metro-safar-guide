/**
 * services/providers/ScheduleProvider.ts
 *
 * MODE A — SCHEDULE (primary, today).
 *
 * Estimates arrivals from the officially published line-level service
 * hours (first/last train) plus an UNVERIFIED assumed headway. UPMRC does
 * not publish a per-station timetable or a real-time API, so every value
 * this provider returns is an ESTIMATE and is labelled freshness:'schedule'.
 *
 * Estimation model:
 *  - A train "pulse" departs each terminus every `headwaySec` seconds once
 *    service starts. `secondsToNext = headwaySec - (nowSec % headwaySec)`.
 *  - 3 upcoming arrivals per direction via successive headway offsets.
 *  - Weekend (Sat/Sun) uses weekendHeadwayMinutes; weekday peak windows
 *    (8–11, 17–20 — UNVERIFIED) use peakHeadwayMinutes; otherwise off-peak.
 *  - Outside service hours there are no arrivals — getOverallStatus()
 *    reports 'not-started-yet' / 'service-ended' and boards stay empty.
 */

import { metroConfig } from '@/data/timings';
import { getStationById, operationalStations } from '@/data/stations';
import type {
  ArrivalEstimate,
  MetroDataProvider,
  ServiceAlert,
  ServiceStatusType,
  StationLiveBoard,
} from '@/services/providers/types';

const PROVIDER_NAME = 'UPMRC Schedule';
const SOURCE_LABEL = 'UPMRC Schedule (estimated frequency)'; // headway UNVERIFIED
const ARRIVALS_PER_DIRECTION = 3;

/** Parse 'HH:MM' (repo convention) into {h, m}. */
function parseHHMM(value: string): { h: number; m: number } {
  const [h, m] = value.split(':').map((v) => Number.parseInt(v, 10));
  return { h: Number.isFinite(h) ? h : 0, m: Number.isFinite(m) ? m : 0 };
}

function minutesFromMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function isWeekend(d: Date): boolean {
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}

export class ScheduleProvider implements MetroDataProvider {
  readonly name = PROVIDER_NAME;
  readonly isLive = false;
  readonly pollIntervalMs = 60_000;

  /** Effective headway (seconds) for a given moment. */
  private headwaySeconds(now: Date): number {
    if (isWeekend(now)) return metroConfig.weekendHeadwayMinutes * 60;

    const m = minutesFromMidnight(now);
    const { h: mpSh, m: mpSm } = parseHHMM(metroConfig.morningPeakStart);
    const { h: mpEh, m: mpEm } = parseHHMM(metroConfig.morningPeakEnd);
    const { h: epSh, m: epSm } = parseHHMM(metroConfig.eveningPeakStart);
    const { h: epEh, m: epEm } = parseHHMM(metroConfig.eveningPeakEnd);

    const inMorningPeak = m >= mpSh * 60 + mpSm && m < mpEh * 60 + mpEm;
    const inEveningPeak = m >= epSh * 60 + epSm && m < epEh * 60 + epEm;

    return inMorningPeak || inEveningPeak
      ? metroConfig.peakHeadwayMinutes * 60
      : metroConfig.offPeakHeadwayMinutes * 60;
  }

  /** Is service running at 'now', per published hours? */
  private isServiceRunning(now: Date): boolean {
    const m = minutesFromMidnight(now) + now.getSeconds() / 60;
    const { h: fh, m: fm } = parseHHMM(metroConfig.firstTrain);
    const { h: lh, m: lm } = parseHHMM(metroConfig.lastTrain);
    return m >= fh * 60 + fm && m < lh * 60 + lm;
  }

  async getOverallStatus(): Promise<ServiceStatusType> {
    const now = new Date();
    const m = minutesFromMidnight(now);
    const { h: fh, m: fm } = parseHHMM(metroConfig.firstTrain);
    const { h: lh, m: lm } = parseHHMM(metroConfig.lastTrain);

    if (m < fh * 60 + fm) return 'not-started-yet';
    if (m >= lh * 60 + lm) return 'service-ended';
    return 'normal';
  }

  async getArrivals(stationId: string, directionTowardId: string): Promise<ArrivalEstimate[]> {
    const station = getStationById(stationId);
    const directionToward = getStationById(directionTowardId);
    const now = new Date();
    const nowMs = now.getTime();

    if (!station || !directionToward || station.status !== 'operational') return [];
    if (!this.isServiceRunning(now)) return [];

    const headwaySec = this.headwaySeconds(now);
    const nowSec = Math.floor(nowMs / 1000);
    // Seconds until the next headway "pulse". UNVERIFIED estimate.
    const secondsToNext = headwaySec - (nowSec % headwaySec);

    return Array.from({ length: ARRIVALS_PER_DIRECTION }, (_, i) => ({
      stationId: station.id,
      directionToward,
      secondsUntilArrival: Math.max(0, secondsToNext + i * headwaySec),
      freshness: 'schedule',
      source: SOURCE_LABEL,
      computedAt: nowMs,
    }));
  }

  async getBoard(stationId: string): Promise<StationLiveBoard> {
    const station = getStationById(stationId);
    const now = Date.now();

    if (!station) throw new Error(`Unknown station: ${stationId}`);

    if (station.status !== 'operational') {
      return {
        station,
        arrivalToward: [],
        providerName: this.name,
        isLive: this.isLive,
        fetchedAt: now,
      };
    }

    // Corridor 1 terminals → the two directions of travel.
    const first = operationalStations[0];
    const last = operationalStations[operationalStations.length - 1];
    const toward = await Promise.all(
      [last, first]
        .filter((t): t is NonNullable<typeof t> => Boolean(t))
        .filter((t) => t.id !== station.id)
        .map((terminal) => this.getArrivals(station.id, terminal.id))
    );

    return {
      station,
      arrivalToward: toward.flat(),
      providerName: this.name,
      isLive: this.isLive,
      fetchedAt: now,
    };
  }

  async getAlerts(): Promise<ServiceAlert[]> {
    // Schedule mode has no disruption feed — nothing verified to report.
    return [];
  }
}
