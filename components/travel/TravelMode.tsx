'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Loader2, LocateFixed, MoveRight, X } from 'lucide-react';
import { useTravelMode } from '@/hooks/useTravelMode';
import { getStationCoordinate } from '@/data/station-coordinates';
import { cn } from '@/lib/utils';

function formatClock(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/** Haversine distance in metres. */
function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Within this radius of a station we mark it as "current/passed". */
const NEAR_STATION_RADIUS_M = 500;

/**
 * Feature 2 — Travel Mode.
 * A high-contrast, big-text companion overlay for use while riding.
 * ETA is derived from journey start time + estimated minutes.
 * GPS progress is manual and on-demand ONLY ("Locate me" button) —
 * the app never auto-tracks. Not real-time tracking — mandatory
 * disclaimer stays visible at all times.
 */
export function TravelMode() {
  const router = useRouter();
  const { isActive, journey, startTime, estimatedArrival, exitTravelMode } = useTravelMode();
  const [now, setNow] = useState<Date | null>(null);

  // Manual, on-demand GPS progress (explicit button press only).
  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [popularStatus, setPopularStatus] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const journeyIdKey = journey ? `${journey.from.id}→${journey.to.id}` : null;

  // Reset the manual location marker whenever a (new) journey starts.
  useEffect(() => {
    setCurrentStationId(null);
    setPopularStatus(null);
  }, [journeyIdKey]);

  useEffect(() => {
    if (!isActive) return;
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, [isActive]);

  const locateMe = useCallback(() => {
    if (!journey) return;
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setPopularStatus('Is device par GPS available nahi hai.');
      return;
    }
    setLocating(true);
    setPopularStatus(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        let bestId: string | null = null;
        let bestDist = Number.POSITIVE_INFINITY;
        for (const s of journey.stations) {
          const c = getStationCoordinate(s.id);
          if (!c) continue;
          const d = distanceMeters(pos.coords.latitude, pos.coords.longitude, c.lat, c.lng);
          if (d < bestDist) {
            bestDist = d;
            bestId = s.id;
          }
        }
        if (bestId && bestDist <= NEAR_STATION_RADIUS_M) {
          setCurrentStationId(bestId);
          const st = journey.stations.find((s) => s.id === bestId);
          setPopularStatus(`Aap approx ${st?.name ?? bestId} ke paas hain (±500 m).`);
        } else {
          setPopularStatus(
            'Aap kisi bhi station se 500 m se zyada door lag rahe hain — kisi station ke paas pahunch kar dobara dabayein.'
          );
        }
      },
      () => {
        setLocating(false);
        setPopularStatus('Location permission nahi mili. Browser settings mein location allow karein.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
    );
  }, [journey]);

  if (!isActive || !journey) return null;

  const remainingMin =
    estimatedArrival && now
      ? Math.max(0, Math.round((estimatedArrival.getTime() - now.getTime()) / 60000))
      : null;

  const currentIdx = currentStationId
    ? journey.stations.findIndex((s) => s.id === currentStationId)
    : -1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Travel mode"
      style={{ height: '100dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Fixed header — never scrolls away */}
      <div className="shrink-0 border-b border-white/10 px-5 py-4">
        <div className="mx-auto w-full max-w-lg">
          <div className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
            <span className="truncate">{journey.from.name}</span>
            <MoveRight className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
            <span className="truncate">{journey.to.name}</span>
          </div>
          <p className="mt-1 text-base text-white/70">
            {journey.stops} stop{journey.stops === 1 ? '' : 's'} · towards{' '}
            <strong className="text-white">{journey.direction.name}</strong>
          </p>
        </div>
      </div>

      {/* Scrollable middle — ALL stations reachable */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-lg px-5 py-6">
          {/* Countdown */}
          <div className="rounded-xl bg-white/10 p-4 text-center sm:p-5">
            {remainingMin !== null ? (
              <>
                <p className="text-sm uppercase tracking-wide text-white/70">Reaching in (estimate)</p>
                <p className="mt-1 text-4xl font-extrabold tabular-nums sm:text-6xl">
                  {remainingMin}
                  <span className="ml-1 text-xl font-semibold sm:text-2xl">min</span>
                </p>
                <p className="mt-2 text-sm text-white/80 sm:text-base">
                  ETA ≈ {formatClock(estimatedArrival!)} · started {startTime ? formatClock(startTime) : '—'}
                </p>
              </>
            ) : (
              <p className="text-lg text-white/80">Time estimate unavailable for this journey.</p>
            )}
          </div>

          {/* Station dots — every station, with passed/current marking */}
          <ol className="mt-8 space-y-0" aria-label="Stations on this journey">
            {journey.stations.map((s, i) => {
              const isTerminal = i === 0 || i === journey.stations.length - 1;
              const isCurrent = i === currentIdx;
              const isPassed = currentIdx >= 0 && i < currentIdx;
              return (
                <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < journey.stations.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-[9px] top-6 h-full w-0.5',
                        isPassed ? 'bg-accent/70' : 'bg-white/30'
                      )}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      isCurrent && 'border-accent bg-accent ring-2 ring-accent/40',
                      isPassed && 'border-accent bg-accent',
                      !isCurrent && !isPassed && (isTerminal ? 'border-accent bg-accent' : 'border-accent bg-navy')
                    )}
                  >
                    {(isPassed || (isCurrent && !isTerminal)) && (
                      <Check className="h-3 w-3 text-navy" aria-hidden="true" />
                    )}
                  </span>
                  <div className={cn('min-w-0 text-base font-medium leading-snug sm:text-lg', isPassed && 'text-white/50')}>
                    {s.name}
                    <span className="ml-2 text-sm font-normal text-white/60">{s.nameHindi}</span>
                    {isCurrent && (
                      <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-navy">
                        You are here
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Fixed footer — disclaimer always visible + GPS (manual) + exit */}
      <div className="shrink-0 border-t border-white/10 bg-navy px-5 pt-3">
        <div className="mx-auto w-full max-w-lg">
          <p className="rounded-md bg-white/10 p-3 text-center text-sm text-white/80">
            Estimates based on journey start time. Not real-time tracking.
          </p>
          <button
            type="button"
            onClick={locateMe}
            disabled={locating}
            className="btn mt-3 h-12 w-full bg-white/15 text-base font-semibold text-white hover:bg-white/25"
          >
            {locating ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <LocateFixed className="h-5 w-5" aria-hidden="true" />
            )}
            {locating ? 'Locating…' : currentStationId ? 'Update my location' : 'Locate me (GPS)'}
          </button>
          {popularStatus && (
            <p className="mt-2 text-center text-sm text-white/70" role="status">
              {popularStatus}
            </p>
          )}
          <div className="mt-3 flex gap-3 pb-4">
            <button
              type="button"
              onClick={() => router.push('/journey')}
              className="btn h-14 flex-1 bg-white/15 text-lg font-semibold text-white hover:bg-white/25"
            >
              Plan another
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={exitTravelMode}
              aria-label="Exit travel mode"
              className="btn h-14 w-14 bg-white/15 p-0 text-white hover:bg-white/25"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
