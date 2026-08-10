'use client';

/**
 * components/arrivals/FreshnessBadge.tsx
 *
 * Trust badge shown next to EVERY arrival display. No exceptions.
 *  - live     → 🟢 LIVE with pulsing dot
 *  - schedule → 🔵 SCHEDULE (estimates from timetable)
 *  - stale    → ⚪ STALE (live data older than threshold)
 */

import type { DataFreshness } from '@/services/providers/types';

export function formatTimeAgo(epochMs: number, nowMs: number): string {
  const sec = Math.max(0, Math.floor((nowMs - epochMs) / 1000));
  if (sec < 10) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

interface FreshnessBadgeProps {
  freshness: DataFreshness;
  /** epoch ms of last fetch — shown for live/stale transparency. */
  updatedAt?: number;
  nowMs?: number;
}

export function FreshnessBadge({ freshness, updatedAt, nowMs }: FreshnessBadgeProps) {
  if (freshness === 'live') {
    return (
      <span className="badge bg-operational/10 text-operational">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-operational opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-operational" />
        </span>
        LIVE
        {updatedAt && nowMs !== undefined && (
          <span className="opacity-75">· {formatTimeAgo(updatedAt, nowMs)}</span>
        )}
      </span>
    );
  }

  if (freshness === 'schedule') {
    return (
      <span className="badge bg-metro-blue/10 text-metro-blue">
        <span className="inline-flex h-2 w-2 rounded-full bg-metro-blue" />
        SCHEDULE
      </span>
    );
  }

  return (
    <span className="badge bg-upcoming/10 text-upcoming">
      <span className="inline-flex h-2 w-2 rounded-full bg-upcoming" />
      STALE
      {updatedAt && nowMs !== undefined && (
        <span className="opacity-75">· {formatTimeAgo(updatedAt, nowMs)}</span>
      )}
    </span>
  );
}
