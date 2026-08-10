'use client';

/**
 * components/arrivals/LiveBoardClient.tsx
 *
 * Phase 12 — both-direction departure board for one station.
 * Reads shareable ?station=&direction= search params and renders a
 * full-width board with mandatory trust badge + schedule disclaimer.
 */

import { RefreshCw, TrainFront } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { metroConfig, ARRIVAL_TIMES_DISCLAIMER } from '@/data/timings';
import { getStationById, operationalStations } from '@/data/stations';
import { useArrivalCountdown, formatEta } from '@/hooks/useArrivalCountdown';
import { metroService } from '@/services/MetroService';
import type { ArrivalEstimate, ServiceStatusType } from '@/services/providers/types';
import { FreshnessBadge } from '@/components/arrivals/FreshnessBadge';
import { ServiceStateMessage } from '@/components/arrivals/ServiceStateMessage';

function DirectionColumn({
  title,
  arrivals,
  loading,
  secondsRemaining,
  freshnessOf,
  nowMs,
  fetchedAt,
}: {
  title: string;
  arrivals: ArrivalEstimate[];
  loading: boolean;
  secondsRemaining: (a: ArrivalEstimate) => number;
  freshnessOf: (a: ArrivalEstimate) => 'live' | 'schedule' | 'stale';
  nowMs: number;
  fetchedAt?: number;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        {arrivals[0] && (
          <FreshnessBadge freshness={freshnessOf(arrivals[0])} updatedAt={fetchedAt} nowMs={nowMs} />
        )}
      </div>

      {loading && arrivals.length === 0 ? (
        <div className="mt-3 animate-pulse space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-11 rounded-md bg-surface" />
          ))}
        </div>
      ) : arrivals.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Is disha mein abhi koi estimate nahi.</p>
      ) : (
        <ol className="mt-3 divide-y divide-appBorder">
          {arrivals.map((a, i) => {
            const eta = secondsRemaining(a);
            return (
              <li
                key={`${a.directionToward.id}-${a.secondsUntilArrival}-${i}`}
                className={`flex min-h-[44px] items-center justify-between gap-3 py-2 ${
                  i === 0 ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className="text-sm">
                  {i === 0 ? 'Next metro' : `Then (+${i + 1})`}
                  {eta <= 60 && i === 0 && (
                    <span className="ml-2 text-xs font-semibold text-accent">Jaldi karo! 🏃</span>
                  )}
                </span>
                <span
                  className={`tabular-nums font-semibold ${
                    i === 0 ? 'text-2xl' : 'text-base'
                  } ${eta <= 60 && i === 0 ? 'text-accent' : ''}`}
                  aria-live={i === 0 ? 'polite' : 'off'}
                >
                  {formatEta(eta)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export function LiveBoardClient() {
  const searchParams = useSearchParams();
  const stationParam = searchParams.get('station');
  const directionParam = searchParams.get('direction');

  const defaultStation = operationalStations[0];
  const initial = stationParam && getStationById(stationParam)?.status === 'operational'
    ? (stationParam as string)
    : defaultStation?.id ?? null;
  const [stationId, setStationId] = useState<string | null>(initial);
  const [status, setStatus] = useState<ServiceStatusType | null>(null);

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

  const first = operationalStations[0];
  const last = operationalStations[operationalStations.length - 1];

  const columns = useMemo(() => {
    if (!board) return [];
    const order = [last, first].filter((t): t is NonNullable<typeof t> => Boolean(t));
    return order
      .filter((t) => t.id !== board.station.id)
      .map((terminal) => ({
        terminal,
        arrivals: board.arrivalToward
          .filter((a) => a.directionToward.id === terminal.id)
          .sort((a, b) => secondsRemaining(a) - secondsRemaining(b)),
      }));
  }, [board, first, last, secondsRemaining]);

  // Put the requested direction (?direction=<terminalId>) first when shareable URL asks for it.
  const orderedColumns = useMemo(() => {
    if (!directionParam) return columns;
    return [...columns].sort((a, b) =>
      a.terminal.id === directionParam ? -1 : b.terminal.id === directionParam ? 1 : 0
    );
  }, [columns, directionParam]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full sm:max-w-sm">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Station
          </span>
          <select
            value={stationId ?? ''}
            onChange={(e) => setStationId(e.target.value || null)}
            className="input text-base sm:text-sm"
            aria-label="Choose station"
          >
            {operationalStations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={refresh} className="btn btn-secondary h-11 w-full sm:w-auto sm:self-end">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {status && status !== 'normal' ? (
        <ServiceStateMessage status={status} firstTrain={metroConfig.firstTrain} />
      ) : error ? (
        <div className="card p-4">
          <p className="text-sm text-muted">Board load nahi ho paya. Dobara koshish karein.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2" aria-busy={loading}>
          {orderedColumns.map(({ terminal, arrivals }) => (
            <DirectionColumn
              key={terminal.id}
              title={`${terminal.name} ki taraf`}
              arrivals={arrivals}
              loading={loading}
              secondsRemaining={secondsRemaining}
              freshnessOf={freshnessOf}
              nowMs={nowMs}
              fetchedAt={board?.fetchedAt}
            />
          ))}
          {board && orderedColumns.length === 0 && (
            <div className="card p-4">
              <TrainFront className="h-5 w-5 text-muted" aria-hidden="true" />
              <p className="mt-2 text-sm text-muted">
                Ye ek terminal station hai — sirf ek disha uplabdh hai.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted">
        {board && <>Based on {board.providerName}. Actual arrival may vary. </>}
        {ARRIVAL_TIMES_DISCLAIMER}
      </p>
    </div>
  );
}
