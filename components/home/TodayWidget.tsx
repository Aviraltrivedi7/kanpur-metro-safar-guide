'use client';

import { useEffect } from 'react';
import { CalendarClock, Clock11, TrainFront } from 'lucide-react';
import {
  OPERATIONAL_STATION_COUNT,
  getNetworkStatus,
  lineTimings,
  upcomingStations,
} from '@/services/metro';
import { trackEvent } from '@/lib/analytics';

const LAST_VISIT_KEY = 'kanpur_metro_last_visit';

/**
 * Feature 10 — "Kanpur Metro — Aaj" TodayWidget.
 * At-a-glance card: operational count, network status, first/last train
 * (with verified flags + last-checked date). Also doubles as the
 * return-visit hook for the growth loop.
 */
export function TodayWidget() {
  // Growth loop: detect a returning visit (gap > 20h counts as a new "visit").
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_VISIT_KEY);
      const now = Date.now();
      if (raw) {
        const last = Number(raw);
        if (Number.isFinite(last) && now - last > 20 * 60 * 60 * 1000) {
          trackEvent('return_visit');
        }
      }
      window.localStorage.setItem(LAST_VISIT_KEY, String(now));
    } catch {
      /* localStorage unavailable — skip */
    }
  }, []);

  const status = getNetworkStatus();
  const aaj = new Date();
  const dateLabel = aaj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <section className="card p-4 sm:p-6" aria-label="Kanpur Metro today">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarClock className="h-5 w-5 text-metro-blue" aria-hidden="true" />
          Kanpur Metro — Aaj
        </h2>
        <time dateTime={aaj.toISOString()} className="text-sm text-muted">
          {dateLabel}
        </time>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <TrainFront className="h-3.5 w-3.5" aria-hidden="true" /> Operational stations
          </dt>
          <dd className="mt-1 text-xl font-bold">{OPERATIONAL_STATION_COUNT}</dd>
        </div>
        <div className="rounded-md bg-surface p-3">
          <dt className="text-xs text-muted">Under construction</dt>
          <dd className="mt-1 text-xl font-bold">{upcomingStations.length}</dd>
        </div>
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Clock11 className="h-3.5 w-3.5" aria-hidden="true" /> First train
          </dt>
          <dd className="mt-1 text-xl font-bold">
            {lineTimings.firstTrain}
            {lineTimings.verified ? (
              <span className="ml-1 align-middle text-xs font-normal text-operational">verified</span>
            ) : (
              <span className="ml-1 align-middle text-xs font-normal text-delayed">unverified</span>
            )}
          </dd>
        </div>
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Clock11 className="h-3.5 w-3.5" aria-hidden="true" /> Last train
          </dt>
          <dd className="mt-1 text-xl font-bold">
            {lineTimings.lastTrain}
            {lineTimings.verified ? (
              <span className="ml-1 align-middle text-xs font-normal text-operational">verified</span>
            ) : (
              <span className="ml-1 align-middle text-xs font-normal text-delayed">unverified</span>
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-sm text-muted">
        Network: <strong className="text-ink">{status.label}</strong> — {status.note}
      </p>
      <p className="mt-1 text-xs text-muted">
        Timings last verified: 2026-08-08 · {lineTimings.note}
      </p>
    </section>
  );
}
