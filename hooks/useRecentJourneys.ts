'use client';

import { useCallback, useEffect, useState } from 'react';

export interface RecentJourney {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  usedAt: string;
  useCount: number;
}

const RECENT_KEY = 'kanpur_metro_recent';
const MAX_RECENT = 5;

function readStored(): RecentJourney[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentJourney[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: RecentJourney[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/**
 * Recently planned journeys tracked automatically.
 * - Sorted by recency, capped at MAX_RECENT entries.
 * - Same from+to increments useCount rather than adding a new entry.
 */
export function useRecentJourneys() {
  const [recent, setRecent] = useState<RecentJourney[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecent(readStored());
    setHydrated(true);
  }, []);

  const addRecent = useCallback((fromId: string, toId: string, fromName: string, toName: string) => {
    setRecent((prev) => {
      const existing = prev.find((p) => p.fromId === fromId && p.toId === toId);
      const rest = prev.filter((p) => !(p.fromId === fromId && p.toId === toId));
      const next: RecentJourney[] = [
        {
          fromId,
          toId,
          fromName,
          toName,
          usedAt: new Date().toISOString(),
          useCount: (existing?.useCount ?? 0) + 1,
        },
        ...rest,
      ].slice(0, MAX_RECENT);
      persist(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecent(() => {
      try {
        window.localStorage.removeItem(RECENT_KEY);
      } catch {
        /* ignore */
      }
      return [];
    });
  }, []);

  return { recent, hydrated, addRecent, clearHistory };
}
