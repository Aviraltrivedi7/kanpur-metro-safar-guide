'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2, MapPin, Navigation } from 'lucide-react';
import {
  findNearestStation,
  googleMapsDirectionsUrl,
  type NearestStation,
} from '@/services/geolocation';
import { trackEvent } from '@/lib/analytics';

const DENIED_KEY = 'kanpur_metro_geo_denied_session';

type GeoState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; result: NearestStation }
  | { kind: 'denied' }
  | { kind: 'error'; message: string };

/**
 * Feature 1 — "Metro station near me".
 * Privacy rules (spec):
 * - Geolocation is requested ONLY when the button is clicked — never on load.
 * - If the user denies, we do not ask again this session.
 * - Distances are always labelled approximate (straight-line, UNVERIFIED coords).
 */
export function NearMe() {
  const [state, setState] = useState<GeoState>({ kind: 'idle' });
  const deniedThisSession = useRef(false);

  useEffect(() => {
    try {
      deniedThisSession.current = window.sessionStorage.getItem(DENIED_KEY) === '1';
      if (deniedThisSession.current) setState({ kind: 'denied' });
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  const locate = useCallback(() => {
    if (deniedThisSession.current) {
      setState({ kind: 'denied' });
      return;
    }
    if (!('geolocation' in navigator)) {
      setState({ kind: 'error', message: 'Location is not supported on this device/browser.' });
      return;
    }
    setState({ kind: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const result = findNearestStation(pos.coords.latitude, pos.coords.longitude);
        trackEvent('near_me_used', { found: result ? 1 : 0 });
        if (result) {
          setState({ kind: 'found', result });
        } else {
          setState({
            kind: 'error',
            message: 'Nearest station coordinates are not available right now.',
          });
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          deniedThisSession.current = true;
          try {
            window.sessionStorage.setItem(DENIED_KEY, '1');
          } catch {
            /* ignore */
          }
          setState({ kind: 'denied' });
        } else {
          setState({
            kind: 'error',
            message: 'Location mil nahi payi. Check GPS/location services and try again.',
          });
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return (
    <section className="card p-5 sm:p-6" aria-label="Find nearest metro station">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Navigation className="h-5 w-5 text-metro-blue" aria-hidden="true" />
        Metro Station Near Me
      </h2>
      <p className="mt-1 text-sm text-muted">
        Ek click — hum aapke sabse paas ka operational station dhoondh denge. Location sirf is
        device par use hoti hai.
      </p>

      {state.kind !== 'found' && (
        <button
          type="button"
          onClick={locate}
          disabled={state.kind === 'loading' || state.kind === 'denied'}
          className="btn btn-primary mt-4 min-h-[48px] w-full sm:w-auto"
        >
          {state.kind === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <MapPin className="h-4 w-4" aria-hidden="true" />
          )}
          {state.kind === 'loading' ? 'Locating…' : 'Find Nearest Station'}
        </button>
      )}

      {state.kind === 'denied' && (
        <p className="mt-4 rounded-md bg-surface p-3 text-sm text-muted" role="status">
          Location permission denied — isliye hum dobara nahi poochhenge is session mein. You can
          still pick a station manually from the list.
        </p>
      )}
      {state.kind === 'error' && (
        <p className="mt-4 rounded-md bg-surface p-3 text-sm text-muted" role="alert">
          {state.message}
        </p>
      )}

      {state.kind === 'found' && (
        <div className="mt-4 rounded-md border border-app bg-surface p-4" role="status">
          <p className="text-xs uppercase tracking-wide text-muted">Your nearest station (approx)</p>
          <p className="mt-1 text-xl font-bold">{state.result.station.name}</p>
          <p className="text-sm text-muted">
            ≈{state.result.distanceKm.toFixed(1)} km away · approx {state.result.walkMinutes} min walk
          </p>
          <p className="mt-2 text-xs text-muted">
            Distance is approximate (straight-line). Walking time is a rough estimate, not a live
            route.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Link
              href={`/journey?from=${encodeURIComponent(state.result.station.id)}`}
              className="btn btn-primary h-11 justify-center px-3 text-sm"
            >
              Plan Journey from here
            </Link>
            {googleMapsDirectionsUrl(state.result.station.id) && (
              <a
                href={googleMapsDirectionsUrl(state.result.station.id)!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary h-11 justify-center px-3 text-sm"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Walking directions
              </a>
            )}
            <button
              type="button"
              onClick={locate}
              className="btn btn-secondary h-11 justify-center px-3 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
