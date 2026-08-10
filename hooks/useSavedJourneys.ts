'use client';

import { useCallback, useEffect, useState } from 'react';

export interface SavedJourney {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  savedAt: string;
}

const STORAGE_KEY = 'kanpur_metro_saved_journeys';
const MAX_SAVED = 10;

function readStored(): SavedJourney[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedJourney[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: SavedJourney[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

/**
 * Saved / bookmarked journeys stored in localStorage.
 * - No login, no backend.
 * - Deduplicates on (fromId, toId).
 * - Never exceeds MAX_SAVED — oldest removed first.
 */
export function useSavedJourneys() {
  const [saved, setSaved] = useState<SavedJourney[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readStored());
    setHydrated(true);
  }, []);

  const saveJourney = useCallback((fromId: string, toId: string, fromName: string, toName: string) => {
    setSaved((prev) => {
      const deduped = prev.filter((p) => !(p.fromId === fromId && p.toId === toId));
      const next: SavedJourney[] = [
        { id: `saved_${Date.now()}`, fromId, toId, fromName, toName, savedAt: new Date().toISOString() },
        ...deduped,
      ].slice(0, MAX_SAVED);
      persist(next);
      return next;
    });
  }, []);

  const removeJourney = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSaved(() => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      return [];
    });
  }, []);

  const isSaved = useCallback(
    (fromId: string, toId: string) => saved.some((s) => s.fromId === fromId && s.toId === toId),
    [saved]
  );

  return { saved, hydrated, saveJourney, removeJourney, clearAll, isSaved };
}
