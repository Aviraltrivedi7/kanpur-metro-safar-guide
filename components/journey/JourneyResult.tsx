'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Check, CircleDot, Clock, MoveRight, Play, Share2, Star, Ticket } from 'lucide-react';
import { calculateFare, calculateJourney, type Journey } from '@/services/metro';
import { useSavedJourneys } from '@/hooks/useSavedJourneys';
import { useRecentJourneys } from '@/hooks/useRecentJourneys';
import { useTravelMode } from '@/hooks/useTravelMode';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** Action buttons + result body, rendered only when a journey exists. */
function JourneyView({ journey }: { journey: Journey }) {
  const { saveJourney, removeJourney, isSaved, hydrated: savedHydrated, saved } = useSavedJourneys();
  const { startTravelMode } = useTravelMode();
  const [copied, setCopied] = useState(false);

  const fare = calculateFare(journey.stops);
  const alreadySaved = savedHydrated && isSaved(journey.from.id, journey.to.id);
  const savedEntry = alreadySaved
    ? saved.find((j) => j.fromId === journey.from.id && j.toId === journey.to.id)
    : undefined;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/journey?from=${journey.from.id}&to=${journey.to.id}`
      : `/journey?from=${journey.from.id}&to=${journey.to.id}`;

  const shareText = `Kanpur Metro: ${journey.from.name} → ${journey.to.name} — ${journey.stops} stop${journey.stops === 1 ? '' : 's'}${fare.fare !== null ? `, approx ₹${fare.fare}` : ''}${journey.estimatedTimeMinutes !== null ? `, ≈${journey.estimatedTimeMinutes} min` : ''}.`;

  function handleToggleSave() {
    if (alreadySaved && savedEntry) {
      removeJourney(savedEntry.id);
    } else {
      saveJourney(journey.from.id, journey.to.id, journey.from.name, journey.to.name);
      trackEvent('journey_saved', { from: journey.from.id, to: journey.to.id });
    }
  }

  async function handleShare() {
    trackEvent('share_clicked', { from: journey.from.id, to: journey.to.id });
    // Prefer the native share sheet (mobile), then clipboard, then WhatsApp.
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Kanpur Metro Journey', text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled or share failed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return;
    } catch {
      /* clipboard blocked — fall through to WhatsApp */
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener');
  }

  function handleShareWhatsApp() {
    trackEvent('share_clicked', { from: journey.from.id, to: journey.to.id, via: 'whatsapp' });
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener');
  }

  function handleStartTravelMode() {
    startTravelMode(journey);
    trackEvent('travel_mode_started', { from: journey.from.id, to: journey.to.id });
  }

  return (
    <section className="card p-5 sm:p-6" aria-label="Journey result">
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-lg font-semibold">
        <span className="truncate">{journey.from.name}</span>
        <MoveRight className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <span className="truncate">{journey.to.name}</span>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Board a train towards <strong className="text-ink">{journey.direction.name}</strong>.
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <CircleDot className="h-3.5 w-3.5" aria-hidden="true" /> Stops
          </dt>
          <dd className="mt-1 text-lg font-bold">{journey.stops}</dd>
        </div>
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Ticket className="h-3.5 w-3.5" aria-hidden="true" /> Fare (estimate)
          </dt>
          <dd className="mt-1 text-lg font-bold">{fare.fare !== null ? `₹${fare.fare}` : '—'}</dd>
        </div>
        <div className="rounded-md bg-surface p-3">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Time (estimate)
          </dt>
          <dd className="mt-1 text-lg font-bold">
            {journey.estimatedTimeMinutes !== null ? `≈${journey.estimatedTimeMinutes} min` : '—'}
          </dd>
        </div>
      </dl>

      {/* Feature 2 — Travel mode entry */}
      <button
        type="button"
        onClick={handleStartTravelMode}
        className="btn btn-primary mt-4 w-full sm:w-auto"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Start Journey Mode
      </button>
      <p className="mt-2 text-xs text-muted">
        Big-text companion for while you travel. Estimates based on journey start time — not
        real-time tracking.
      </p>

      {/* Vertical station line — origin and destination get accent dots */}
      <ol className="mt-5 space-y-0" aria-label="Stations on this journey">
        {journey.stations.map((s, i) => {
          const isTerminal = i === 0 || i === journey.stations.length - 1;
          const isOrigin = i === 0;
          const isDestination = i === journey.stations.length - 1;
          return (
            <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < journey.stations.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-5 h-full w-0.5 bg-metro-blue/30"
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-metro-blue',
                  isTerminal ? 'bg-metro-blue' : 'bg-card'
                )}
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Link href={`/stations/${s.id}`} className="text-sm font-medium hover:text-metro-blue">
                    {s.name}
                  </Link>
                  <span className="text-xs text-muted">{s.nameHindi}</span>
                  {isOrigin && (
                    <span className="badge bg-metro-blue/10 text-metro-blue">Board here</span>
                  )}
                  {isDestination && (
                    <span className="badge bg-accent/15 text-accent">Get off here</span>
                  )}
                </p>
                {isDestination && (
                  <p className="mt-1 text-xs font-medium text-muted">
                    Last stop for this journey — train continues to {journey.direction.name}.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Save / Share / WhatsApp — bottom of the card, above the fare disclaimer */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Feature 3 — Save this journey */}
        <button
          type="button"
          onClick={handleToggleSave}
          aria-pressed={alreadySaved}
          className={cn('btn h-11 w-full justify-center px-3 text-sm sm:w-auto', alreadySaved ? 'btn-primary' : 'btn-secondary')}
        >
          <Star className={cn('h-4 w-4', alreadySaved && 'fill-current')} aria-hidden="true" />
          {alreadySaved ? 'Saved' : 'Save'}
        </button>
        {/* Feature 7 — Send to friend */}
        <button type="button" onClick={handleShare} className="btn btn-secondary h-11 w-full justify-center px-3 text-sm sm:w-auto">
          {copied ? (
            <Check className="h-4 w-4 text-operational" aria-hidden="true" />
          ) : (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? 'Copied!' : 'Share'}
        </button>
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="btn btn-secondary h-11 w-full justify-center px-3 text-sm sm:w-auto"
          aria-label="Send this journey to a friend on WhatsApp"
        >
          WhatsApp
        </button>
      </div>

      <p className="mt-4 border-t border-app pt-3 text-xs text-muted">{fare.disclaimer}</p>
    </section>
  );
}

export function JourneyResult({ fromId, toId }: { fromId: string; toId: string }) {
  const journey: Journey | null = calculateJourney(fromId, toId);
  const { addRecent } = useRecentJourneys();
  const recordedRef = useRef<string>('');

  // Feature 4 — record this journey in recent history (once per from→to change).
  const fromStationId = journey?.from.id;
  const toStationId = journey?.to.id;
  const fromStationName = journey?.from.name;
  const toStationName = journey?.to.name;
  const journeyStops = journey?.stops;

  useEffect(() => {
    if (!fromStationId || !toStationId || !fromStationName || !toStationName) return;
    const key = `${fromStationId}→${toStationId}`;
    if (recordedRef.current === key) return;
    recordedRef.current = key;
    addRecent(fromStationId, toStationId, fromStationName, toStationName);
    trackEvent('journey_planned', { from: fromStationId, to: toStationId, stops: journeyStops ?? 0 });
  }, [fromStationId, toStationId, fromStationName, toStationName, journeyStops, addRecent]);

  if (!journey) {
    return (
      <div className="card p-6" role="status">
        <p className="font-medium">Arre, yeh journey plan nahi ho payi.</p>
        <p className="mt-1 text-sm text-muted">
          One of the selected stations may not be operational yet. Choose from the 14 operational
          stations on Corridor 1 (IIT Kanpur ↔ Kanpur Central).
        </p>
      </div>
    );
  }

  return <JourneyView journey={journey} />;
}
