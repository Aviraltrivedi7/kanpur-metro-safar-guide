'use client';

import Link from 'next/link';
import { MoveRight, Star, Trash2, X } from 'lucide-react';
import { useSavedJourneys } from '@/hooks/useSavedJourneys';

/**
 * Feature 3 — "Your Saved Journeys" homepage section.
 * Rendered only when the user actually has saved journeys.
 */
export function SavedJourneys() {
  const { saved, hydrated, removeJourney, clearAll } = useSavedJourneys();

  if (!hydrated || saved.length === 0) return null;

  return (
    <section className="card p-4 sm:p-6" aria-label="Your saved journeys">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold">
          <Star className="h-5 w-5 shrink-0 fill-accent text-accent" aria-hidden="true" />
          <span className="truncate">Your Saved Journeys</span>
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-secondary h-9 shrink-0 px-3 text-xs"
          aria-label="Clear all saved journeys"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Clear All
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">Ek tap mein wapas plan karo — saved on this device only.</p>

      <ul className="mt-3 divide-y divide-app">
        {saved.map((j) => (
          <li key={j.id} className="flex items-center gap-2 py-2">
            <Link
              href={`/journey?from=${encodeURIComponent(j.fromId)}&to=${encodeURIComponent(j.toId)}`}
              className="group flex min-h-[44px] min-w-0 flex-1 items-center gap-2 text-sm font-medium hover:text-metro-blue"
            >
              <span className="truncate">{j.fromName}</span>
              <MoveRight className="h-4 w-4 shrink-0 text-muted group-hover:text-metro-blue" aria-hidden="true" />
              <span className="truncate">{j.toName}</span>
              <span className="ml-auto shrink-0 text-xs font-semibold text-metro-blue">Plan →</span>
            </Link>
            <button
              type="button"
              onClick={() => removeJourney(j.id)}
              aria-label={`Remove saved journey ${j.fromName} to ${j.toName}`}
              className="btn btn-secondary h-10 w-10 shrink-0 p-0"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
