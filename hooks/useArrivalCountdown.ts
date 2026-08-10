'use client';

/**
 * hooks/useArrivalCountdown.ts
 *
 * Phase 12 — arrival polling + per-second countdown.
 *
 * Behaviour:
 *  - Fetches the arrival board via metroService every `pollMs` (default 30s).
 *  - Ticks every 1s recomputing remaining seconds from computedAt + estimate.
 *  - Arrival seconds clamp at 0 — never negative (displayed as "Arriving").
 *  - Stale-downgrade applies ONLY to live data: a live estimate older than
 *    NEXT_PUBLIC_STALE_DATA_THRESHOLD_SECONDS (default 120s) becomes 'stale'.
 *    Schedule data is stable by definition and never goes stale.
 *  - Offline: navigator.onLine listener + refetch on reconnect.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { metroService } from '@/services/MetroService';
import type { ArrivalEstimate, DataFreshness, StationLiveBoard } from '@/services/providers/types';

const DEFAULT_POLL_MS = 30_000;

export function staleThresholdSeconds(): number {
  const raw = Number.parseInt(
    process.env.NEXT_PUBLIC_STALE_DATA_THRESHOLD_SECONDS ?? '',
    10
  );
  return Number.isFinite(raw) && raw > 0 ? raw : 120;
}

/** Format a remaining-seconds value for display. Never goes below 0. */
export function formatEta(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '--';
  const s = Math.max(0, Math.round(seconds));
  if (s <= 30) return 'Arriving';
  if (s < 60) return `${s}s`;
  const mins = Math.floor(s / 60);
  if (mins < 10) {
    const rem = s % 60;
    return rem === 0 ? `${mins} min` : `${mins}:${String(rem).padStart(2, '0')}`;
  }
  return `${Math.round(s / 60)} min`;
}

function downgradeIfStale(arrival: ArrivalEstimate, nowMs: number): DataFreshness {
  if (arrival.freshness !== 'live') return arrival.freshness; // schedule never stales
  const ageSec = (nowMs - arrival.computedAt) / 1000;
  return ageSec > staleThresholdSeconds() ? 'stale' : 'live';
}

export interface UseArrivalCountdownResult {
  board: StationLiveBoard | null;
  loading: boolean;
  error: boolean;
  /** epoch ms of the current render tick — drives countdown updates. */
  nowMs: number;
  online: boolean;
  refresh: () => void;
  /** Remaining seconds for an arrival estimate, counting down live, clamped at 0. */
  secondsRemaining: (a: ArrivalEstimate) => number;
  /** Freshness after stale-downgrade, evaluated at current tick. */
  freshnessOf: (a: ArrivalEstimate) => DataFreshness;
}

export function useArrivalCountdown(
  stationId: string | null,
  pollMs: number = DEFAULT_POLL_MS
): UseArrivalCountdownResult {
  const [board, setBoard] = useState<StationLiveBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [online, setOnline] = useState<boolean>(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const mountedRef = useRef(true);

  const fetchBoard = useCallback(async () => {
    if (!stationId) {
      setBoard(null);
      setLoading(false);
      return;
    }
    try {
      const data = await metroService.getBoard(stationId);
      if (mountedRef.current) {
        setBoard(data);
        setError(false);
      }
    } catch {
      if (mountedRef.current) setError(true);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [stationId]);

  // Poll loop.
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    void fetchBoard();
    const id = window.setInterval(() => void fetchBoard(), pollMs);
    return () => {
      mountedRef.current = false;
      window.clearInterval(id);
    };
  }, [fetchBoard, pollMs]);

  // 1-second tick for countdowns.
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Online/offline awareness — refetch immediately on reconnect.
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      void fetchBoard();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [fetchBoard]);

  const secondsRemaining = useCallback(
    (a: ArrivalEstimate): number =>
      Math.max(0, a.secondsUntilArrival - (nowMs - a.computedAt) / 1000),
    [nowMs]
  );

  const freshnessOf = useCallback(
    (a: ArrivalEstimate): DataFreshness => downgradeIfStale(a, nowMs),
    [nowMs]
  );

  const refresh = useCallback(() => {
    setLoading(true);
    void fetchBoard();
  }, [fetchBoard]);

  return useMemo(
    () => ({ board, loading, error, nowMs, online, refresh, secondsRemaining, freshnessOf }),
    [board, loading, error, nowMs, online, refresh, secondsRemaining, freshnessOf]
  );
}
