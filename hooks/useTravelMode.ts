'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Journey } from '@/services/metro';

export interface TravelModeState {
  isActive: boolean;
  journey: Journey | null;
  startTime: Date | null;
  estimatedArrival: Date | null;
}

const STORAGE_KEY = 'kanpur_metro_travel_mode';
/** Same-tab sync — storage events don't fire in the tab that wrote. */
const SYNC_EVENT = 'km-travel-mode-changed';

interface StoredTravel {
  journey: Journey;
  startTime: string;
}

function readStored(): TravelModeState {
  if (typeof window === 'undefined') {
    return { isActive: false, journey: null, startTime: null, estimatedArrival: null };
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { isActive: false, journey: null, startTime: null, estimatedArrival: null };
    const parsed = JSON.parse(raw) as StoredTravel;
    const start = new Date(parsed.startTime);
    const minutes = parsed.journey?.estimatedTimeMinutes;
    return {
      isActive: true,
      journey: parsed.journey ?? null,
      startTime: start,
      estimatedArrival: minutes == null ? null : new Date(start.getTime() + minutes * 60 * 1000),
    };
  } catch {
    return { isActive: false, journey: null, startTime: null, estimatedArrival: null };
  }
}

/**
 * "I'm Travelling" mode.
 * - Simple companion, not a live tracker.
 * - Uses journey start time + estimated minutes to derive ETA.
 * - sessionStorage is the source of truth so EVERY mounted instance
 *   (JourneyResult on the page + TravelMode overlay in the root layout)
 *   stays in sync — in this tab via a custom event, across tabs via storage.
 * - Explicitly NOT continuous GPS tracking; disclaimer shown in UI.
 */
export function useTravelMode() {
  const [state, setState] = useState<TravelModeState>({
    isActive: false,
    journey: null,
    startTime: null,
    estimatedArrival: null,
  });

  // Hydrate from sessionStorage and keep this instance in sync with
  // any start/exit happening elsewhere (other hook instances or tabs).
  useEffect(() => {
    const sync = () => setState(readStored());
    sync();
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const startTravelMode = useCallback((journey: Journey) => {
    const startTime = new Date();
    const estimatedArrival =
      journey.estimatedTimeMinutes == null
        ? null
        : new Date(startTime.getTime() + journey.estimatedTimeMinutes * 60 * 1000);
    setState({ isActive: true, journey, startTime, estimatedArrival });
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ journey, startTime: startTime.toISOString() })
      );
    } catch {
      /* sessionStorage unavailable — mode still works in memory */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  const exitTravelMode = useCallback(() => {
    setState({ isActive: false, journey: null, startTime: null, estimatedArrival: null });
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  return { ...state, startTravelMode, exitTravelMode };
}
