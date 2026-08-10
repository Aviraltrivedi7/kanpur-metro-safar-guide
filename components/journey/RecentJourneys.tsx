'use client';

import Link from 'next/link';
import { History, MoveRight, Repeat, Trash2 } from 'lucide-react';
import { useRecentJourneys } from '@/hooks/useRecentJourneys';

/** Time-aware greeting, Hinglish-flavoured (UI copy only). */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Feature 4 — personalized homepage widget driven by recent-journey history.
 * Shows the last journey, the full recent list, and "your usual journey"
 * once a pair has been used 3+ times. Hidden on first visit.
 */
export function RecentJourneys() {
  const { recent, hydrated, clearHistory } = useRecentJourneys();

  if (!hydrated || recent.length === 0) return null;

  const last = recent[0];
  const usual = recent.find((r) => r.useCount >= 3);

  return (
    <section className="card p-4 sm:p-6" aria-label="Your recent journeys">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold">
          <History className="h-5 w-5 shrink-0 text-metro-blue" aria-hidden="true" />
          <span className="truncate">{greeting()} — wapas chaliye?</span>
        </h2>
        <button
          type="button"
          onClick={clearHistory}
          className="btn btn-secondary h-9 shrink-0 px-3 text-xs"
          aria-label="Clear journey history"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Clear History
        </button>
      </div>

      {/* Last journey — one tap to plan again */}
      <Link
        href={`/journey?from=${encodeURIComponent(last.fromId)}&to=${encodeURIComponent(last.toId)}`}
        className="mt-3 flex min-h-[48px] items-center gap-2 rounded-md border border-app bg-surface p-3 text-sm font-medium hover:border-metro-blue"
      >
        <span className="shrink-0 text-xs uppercase tracking-wide text-muted">Your last journey</span>
        <span className="min-w-0 flex-1 truncate text-right">
          {last.fromName} <MoveRight className="inline h-3.5 w-3.5 text-muted" aria-hidden="true" />{' '}
          {last.toName}
        </span>
        <span className="shrink-0 text-xs font-semibold text-metro-blue">Plan Again →</span>
      </Link>

      {/* Usual journey */}
      {usual && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Repeat className="h-4 w-4 text-accent" aria-hidden="true" />
          Your usual journey:{' '}
          <Link
            href={`/journey?from=${encodeURIComponent(usual.fromId)}&to=${encodeURIComponent(usual.toId)}`}
            className="font-medium text-ink hover:text-metro-blue"
          >
            {usual.fromName} → {usual.toName}
          </Link>
        </p>
      )}

      {/* Recent list */}
      <ul className="mt-3 divide-y divide-app" aria-label="Recent journeys">
        {recent.map((r) => (
          <li key={`${r.fromId}-${r.toId}`}>
            <Link
              href={`/journey?from=${encodeURIComponent(r.fromId)}&to=${encodeURIComponent(r.toId)}`}
              className="group flex min-h-[44px] items-center gap-2 py-1.5 text-sm hover:text-metro-blue"
            >
              <span className="truncate">{r.fromName}</span>
              <MoveRight className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-metro-blue" aria-hidden="true" />
              <span className="truncate">{r.toName}</span>
              {r.useCount > 1 && (
                <span className="ml-auto shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                  ×{r.useCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
