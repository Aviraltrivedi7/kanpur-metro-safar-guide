/**
 * services/providers/types.ts
 *
 * Phase 12 — Real-time Arrival + Journey Intelligence System.
 *
 * CRITICAL HONESTY NOTE:
 * UPMRC does NOT publish a verified public real-time API. All arrival
 * data today is ESTIMATED from the official published schedule plus an
 * unverified assumed headway. Never present these times as live.
 *
 * Two modes:
 *  - MODE A — SCHEDULE (primary, today): 🔵 SCHEDULE badge.
 *  - MODE B — LIVE (future, 🟢 LIVE): pluggable via provider swap with
 *    zero frontend changes. MetroService switches automatically when
 *    official env credentials become available.
 */

import type { Station } from '@/data/stations';

/** How fresh the returned data is. 'schedule' = derived from timetable, not live. */
export type DataFreshness = 'live' | 'schedule' | 'stale';

/** A single estimated arrival at one station, in one direction. */
export interface ArrivalEstimate {
  stationId: string;
  /** Terminal the train is heading toward. */
  directionToward: Station;
  /** Seconds from 'now' until arrival (clamped at 0). */
  secondsUntilArrival: number;
  freshness: DataFreshness;
  /** Human-readable source label, e.g. 'UPMRC Schedule'. */
  source: string;
  /** epoch ms when this estimate was computed/fetched. */
  computedAt: number;
}

/** Both-direction arrival board for one station. */
export interface StationLiveBoard {
  station: Station;
  arrivalToward: ArrivalEstimate[];
  providerName: string;
  isLive: boolean;
  fetchedAt: number;
}

export type ServiceStatusType = 'normal' | 'not-started-yet' | 'service-ended' | 'unavailable';

export interface ServiceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  active: boolean;
}

/**
 * The pluggable data-provider contract. Any future official UPMRC feed
 * implements this interface and MetroService adopts it without touching
 * the UI.
 */
export interface MetroDataProvider {
  readonly name: string;
  readonly isLive: boolean;
  /** Suggested polling cadence for consumers. */
  readonly pollIntervalMs: number;
  getArrivals(stationId: string, directionTowardId: string): Promise<ArrivalEstimate[]>;
  getBoard(stationId: string): Promise<StationLiveBoard>;
  getOverallStatus(): Promise<ServiceStatusType>;
  getAlerts(): Promise<ServiceAlert[]>;
}
