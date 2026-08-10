'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, MoveRight, X } from 'lucide-react';
import { useTravelMode } from '@/hooks/useTravelMode';
import { cn } from '@/lib/utils';

function formatClock(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Feature 2 — Travel Mode.
 * A high-contrast, big-text companion overlay for use while riding.
 * ETA is derived from journey start time + estimated minutes.
 * NOT real-time tracking — the disclaimer is mandatory and always visible.
 */
export function TravelMode() {
  const router = useRouter();
  const { isActive, journey, startTime, estimatedArrival, exitTravelMode } = useTravelMode();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!isActive) return;
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, [isActive]);

  if (!isActive || !journey) return null;

  const remainingMin =
    estimatedArrival && now
      ? Math.max(0, Math.round((estimatedArrival.getTime() - now.getTime()) / 60000))
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col bg-navy text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Travel mode"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-6">
        {/* Header: from → to, big text (≥18px) */}
        <div className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
          <span className="truncate">{journey.from.name}</span>
          <MoveRight className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
          <span className="truncate">{journey.to.name}</span>
        </div>
        <p className="mt-1 text-base text-white/70">
          {journey.stops} stop{journey.stops === 1 ? '' : 's'} · towards{' '}
          <strong className="text-white">{journey.direction.name}</strong>
        </p>

        {/* Countdown */}
        <div className="mt-6 rounded-xl bg-white/10 p-4 text-center sm:mt-8 sm:p-5">
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

        {/* Station dots */}
        <ol className="mt-8 flex-1 space-y-0 overflow-y-auto" aria-label="Stations on this journey">
          {journey.stations.map((s, i) => {
            const isTerminal = i === 0 || i === journey.stations.length - 1;
            return (
              <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
                {i < journey.stations.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[9px] top-6 h-full w-0.5 bg-white/30"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative z-10 mt-1.5 h-5 w-5 shrink-0 rounded-full border-2 border-accent',
                    isTerminal ? 'bg-accent' : 'bg-navy'
                  )}
                />
                <div className="min-w-0 text-base font-medium leading-snug sm:text-lg">
                  {s.name}
                  <span className="ml-2 text-sm font-normal text-white/60">{s.nameHindi}</span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Mandatory disclaimer + exit */}
        <p className="mt-4 rounded-md bg-white/10 p-3 text-center text-sm text-white/80">
          Estimates based on journey start time. Not real-time tracking.
        </p>
        <div className="mt-4 flex gap-3">
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
  );
}
