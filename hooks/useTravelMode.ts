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
 * - Saved to sessionStorage so a page refresh does not interrupt it.
 * - Explicitly NOT real-time GPS tracking; disclaimer shown in UI.
 */
export function useTravelMode() {
  const [state, setState] = useState<TravelModeState>({
    isActive: false,
    journey: null,
    startTime: null,
    estimatedArrival: null,
  });

  // Restore travel mode after a page refresh (sessionStorage only).
  useEffect(() => {
    const stored = readStored();
    if (stored.isActive && stored.journey && stored.startTime) setState(stored);
  }, []);

  const startTravelMode = useCallback((journey: Journey) => {
    const startTime = new Date();
    const estimatedArrival =
      journey.estimatedTimeMinutes == null
        ? null
        : new Date(startTime.getTime() + journey.estimatedTimeMinutes * 60 * 1000);
    const next: TravelModeState = { isActive: true, journey, startTime, estimatedArrival };
    setState(next);
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ journey, startTime: startTime.toISOString() })
      );
    } catch {
      /* sessionStorage unavailable — mode still works in memory */
    }
  }, []);

  const exitTravelMode = useCallback(() => {
    setState({ isActive: false, journey: null, startTime: null, estimatedArrival: null });
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { ...state, startTravelMode, exitTravelMode };
}
