'use client';

/**
 * components/journey/WhenToLeave.tsx
 *
 * Phase 12 — "⏰ Kab nikalna chahiye?" departure-time calculator.
 *
 * total leave-in = walk to station (user slider) + average platform wait
 * (⌈headway/2⌉, UNVERIFIED) + in-train journey time (estimatedTimeMinutes,
 * UNVERIFIED estimate).
 */

import { AlarmClock, Footprints, Hourglass, TrainFront } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Journey } from '@/data/routes';
import { metroConfig } from '@/data/timings';

const DEFAULT_WALK_MINUTES = 5;

interface WhenToLeaveProps {
  journey: Journey;
}

function formatLeaveTime(minsFromNow: number): string {
  return new Date(Date.now() + minsFromNow * 60_000).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function WhenToLeave({ journey }: WhenToLeaveProps) {
  const [walkMinutes, setWalkMinutes] = useState(DEFAULT_WALK_MINUTES);

  const breakdown = useMemo(() => {
    if (journey.estimatedTimeMinutes === null) return null;

    const waitMinutes = Math.ceil(
      Math.max(metroConfig.peakHeadwayMinutes, metroConfig.offPeakHeadwayMinutes) / 2
    ); // UNVERIFIED average wait
    const now = Date.now();
    // Next train window: arrive just as the next headway pulse departs.
    const trainInMinutes = waitMinutes;
    const leaveInMinutes = Math.max(0, trainInMinutes - walkMinutes);
    const totalMinutes = walkMinutes + waitMinutes + journey.estimatedTimeMinutes;

    return {
      walkMinutes,
      waitMinutes,
      journeyMinutes: journey.estimatedTimeMinutes,
      leaveInMinutes,
      leaveAtLabel: formatLeaveTime(leaveInMinutes),
      totalMinutes,
      arriveByLabel: formatLeaveTime(leaveInMinutes + totalMinutes),
      planningAt: now,
    };
  }, [journey.estimatedTimeMinutes, walkMinutes]);

  return (
    <section aria-labelledby="when-to-leave-heading" className="card p-4 sm:p-5">
      <h2
        id="when-to-leave-heading"
        className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
      >
        <AlarmClock className="h-5 w-5 text-metro-blue" aria-hidden="true" />
        ⏰ Kab nikalna chahiye?
      </h2>

      {!breakdown ? (
        <p className="mt-3 text-sm text-muted">
          Is journey ke liye samay ka estimate uplabdh nahi hai.
        </p>
      ) : (
        <>
          <p className="mt-3 text-2xl font-bold tabular-nums text-ink" aria-live="polite">
            {breakdown.leaveInMinutes <= 1 ? (
              <>Abhi nikal jao! 🏃</>
            ) : (
              <>
                <span className="text-metro-blue">{breakdown.leaveInMinutes} min</span> mein nikalna
                hoga
              </>
            )}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            Leave by <span className="font-semibold text-ink">{breakdown.leaveAtLabel}</span> —
            approx {breakdown.totalMinutes} min total, {journey.to.name} ≈{' '}
            {breakdown.arriveByLabel}.
          </p>

          <label className="mt-4 block">
            <span className="mb-1 flex items-center justify-between text-sm text-muted">
              <span>Walk time to station</span>
              <span className="font-semibold text-ink">{walkMinutes} min</span>
            </span>
            <input
              type="range"
              min={1}
              max={30}
              value={walkMinutes}
              onChange={(e) => setWalkMinutes(Number(e.target.value))}
              className="w-full accent-[var(--color-metro-blue)]"
              style={{ minHeight: 44 }}
              aria-label="Walking time to station in minutes"
            />
          </label>

          <ul className="mt-4 space-y-2 text-sm" aria-label="Journey time breakdown">
            <li className="flex min-h-[44px] items-center justify-between rounded-md bg-surface px-3">
              <span className="flex items-center gap-2 text-muted">
                <Footprints className="h-4 w-4" aria-hidden="true" /> Walk to station
              </span>
              <span className="font-semibold tabular-nums text-ink">{breakdown.walkMinutes} min</span>
            </li>
            <li className="flex min-h-[44px] items-center justify-between rounded-md bg-surface px-3">
              <span className="flex items-center gap-2 text-muted">
                <Hourglass className="h-4 w-4" aria-hidden="true" /> Average wait
              </span>
              <span className="font-semibold tabular-nums text-ink">≈{breakdown.waitMinutes} min</span>
            </li>
            <li className="flex min-h-[44px] items-center justify-between rounded-md bg-surface px-3">
              <span className="flex items-center gap-2 text-muted">
                <TrainFront className="h-4 w-4" aria-hidden="true" /> Metro ride ({journey.stops}{' '}
                stop{journey.stops === 1 ? '' : 's'})
              </span>
              <span className="font-semibold tabular-nums text-ink">
                ≈{breakdown.journeyMinutes} min
              </span>
            </li>
          </ul>

          <p className="mt-4 border-t border-appBorder pt-3 text-xs text-muted">
            ⚠ Estimates only — {journey.from.name} se walk time aapke pace par nirbhar hai; average
            wait schedule-based assumption hai ({metroConfig.peakHeadwayMinutes}–
            {metroConfig.offPeakHeadwayMinutes} min frequency ka aadha, UNVERIFIED). Estimates based
            on journey start time. Not real-time tracking. Please leave early and verify at the
            station.
          </p>
        </>
      )}
    </section>
  );
}
