'use client';

/**
 * components/arrivals/NextMetroWidget.tsx
 *
 * Phase 12 hero feature — "Next Metro" arrival estimator.
 *
 *  - Station selector + direction toggle (≥44px touch targets).
 *  - Large tabular-nums ETA — amber highlight ≤60s with "Jaldi karo! 🏃".
 *  - Schedule-mode disclaimer is ALWAYS visible (ARRIVAL_TIMES_DISCLAIMER).
 *  - Not-started / service-ended states via ServiceStateMessage.
 */

import { Clock, RefreshCw, TrainFront } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { metroConfig, ARRIVAL_TIMES_DISCLAIMER } from '@/data/timings';
import { operationalStations } from '@/data/stations';
import { useArrivalCountdown, formatEta } from '@/hooks/useArrivalCountdown';
import { metroService } from '@/services/MetroService';
import type { ArrivalEstimate, ServiceStatusType } from '@/services/providers/types';
import { FreshnessBadge } from '@/components/arrivals/FreshnessBadge';
import { ServiceStateMessage } from '@/components/arrivals/ServiceStateMessage';

interface NextMetroWidgetProps {
  /** Station pages pass this to skip the selector. */
  preSelectedStationId?: string;
}

function nearestEstimate(a: ArrivalEstimate, nowMs: number): number {
  return Math.max(0, a.secondsUntilArrival - (nowMs - a.computedAt) / 1000);
}

export function NextMetroWidget({ preSelectedStationId }: NextMetroWidgetProps) {
  const [stationId, setStationId] = useState<string | null>(preSelectedStationId ?? null);
  const [directionId, setDirectionId] = useState<string | null>(null);
  const [status, setStatus] = useState<ServiceStatusType | null>(null);

  const first = operationalStations[0];
  const last = operationalStations[operationalStations.length - 1];

  // Terminal stations can't pick "toward themselves".
  useEffect(() => {
    if (!stationId) {
      setDirectionId(null);
      return;
    }
    if (stationId === last.id) setDirectionId(first.id);
    else if (stationId === first.id) setDirectionId(last.id);
    else setDirectionId((prev) => prev ?? last.id);
  }, [stationId, first.id, last.id]);

  useEffect(() => {
    let active = true;
    void metroService.getOverallStatus().then((s) => {
      if (active) setStatus(s);
    });
    return () => {
      active = false;
    };
  }, []);

  const { board, loading, error, nowMs, refresh, secondsRemaining, freshnessOf } =
    useArrivalCountdown(stationId);

  const arrivals = useMemo(() => {
    if (!board || !directionId) return [];
    return board.arrivalToward
      .filter((a) => a.directionToward.id === directionId)
      .sort((a, b) => nearestEstimate(a, nowMs) - nearestEstimate(b, nowMs));
  }, [board, directionId, nowMs]);

  const primary = arrivals[0] ?? null;
  const upcoming = arrivals.slice(1, 3);
  const eta = primary ? secondsRemaining(primary) : null;
  const urgent = eta !== null && eta <= 60;

  const toggleDirection = useCallback(() => {
    setDirectionId((prev) => (prev === last.id ? first.id : last.id));
  }, [first.id, last.id]);

  return (
    <section aria-labelledby="next-metro-heading" className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="next-metro-heading"
          className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
        >
          <TrainFront className="h-5 w-5 text-metro-blue" aria-hidden="true" />
          Next Metro
        </h2>
        {primary && <FreshnessBadge freshness={freshnessOf(primary)} updatedAt={board?.fetchedAt} nowMs={nowMs} />}
      </div>

      {!preSelectedStationId && (
        <div className="mt-3">
          <label className="block">
            <span className="sr-only">Station</span>
            <select
              value={stationId ?? ''}
              onChange={(e) => setStationId(e.target.value || null)}
              className="input w-full text-base sm:max-w-sm sm:text-sm"
              aria-label="Choose station"
            >
              <option value="">Station chunein…</option>
              {operationalStations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mt-4">
        {!stationId ? (
          <p className="text-sm text-muted">
            Apna station chunein — agli metro kab aa rahi hai, dekh lijiye.
          </p>
        ) : status && status !== 'normal' ? (
          <ServiceStateMessage status={status} firstTrain={metroConfig.firstTrain} />
        ) : error ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Data load nahi ho paya. Dobara koshish karein.</p>
            <button type="button" onClick={refresh} className="btn btn-secondary h-11">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        ) : loading && arrivals.length === 0 ? (
          <div className="animate-pulse space-y-2" aria-hidden="true">
            <div className="h-10 w-40 rounded-md bg-surface" />
            <div className="h-4 w-56 rounded-md bg-surface" />
          </div>
        ) : !primary ? (
          <p className="text-sm text-muted">Is disha mein abhi koi arrival estimate nahi hai.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {primary.directionToward.name} ki taraf
                </p>
                <p
                  className={`font-display text-5xl font-bold tabular-nums leading-none ${
                    urgent ? 'text-accent' : 'text-ink'
                  }`}
                  aria-live="polite"
                >
                  {formatEta(eta)}
                </p>
                {urgent && (
                  <p className="mt-1 text-sm font-semibold text-accent">Jaldi karo! 🏃</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Direction toggle — hidden at terminal stations (single direction). */}
                {stationId !== first.id && stationId !== last.id && (
                  <button
                    type="button"
                    onClick={toggleDirection}
                    className="btn btn-secondary h-11"
                  >
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {directionId === first.id ? `Toward ${first.name}` : `Toward ${last.name}`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={refresh}
                  className="btn btn-secondary h-11"
                  aria-label="Refresh arrivals"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Refresh
                </button>
              </div>
            </div>

            {upcoming.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Following metros">
                {upcoming.map((a, i) => (
                  <li
                    key={`${a.directionToward.id}-${i}`}
                    className="badge bg-surface text-muted"
                  >
                    +{i + 2}: {formatEta(secondsRemaining(a))}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {board && (
        <p className="mt-4 border-t border-appBorder pt-3 text-xs text-muted">
          Based on {board.providerName}. Actual arrival may vary.
          <br />
          {ARRIVAL_TIMES_DISCLAIMER}
        </p>
      )}
    </section>
  );
}
