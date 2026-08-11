'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'km_splash_shown';
const MIN_DURATION_MS = 2200;   // minimum time splash stays visible (normal motion)
const REDUCED_MIN_MS = 800;     // shorter when user prefers reduced motion
const SAFETY_TIMEOUT_MS = 4000; // hard failsafe — never block the site

interface SplashLogic {
  shouldShow: boolean;          // is splash currently visible?
  isFirstSession: boolean;      // first visit in this browser session?
  prefersReducedMotion: boolean;
  markAppReady: () => void;     // call once content has painted
}

/**
 * Splash timing/session logic.
 *
 * - Shows ONLY on first load (or hard refresh) in a browser session.
 * - SPA navigation inside the site does NOT re-trigger it (sessionStorage
 *   persists for the tab session) and the layout doesn't remount per route.
 * - sessionStorage is cleared when the tab is closed → next visit shows it again.
 * - Hides only when BOTH the minimum display time AND app readiness pass.
 * - A 4s safety timeout guarantees the splash always lets the user through.
 */
export function useSplashLogic(): SplashLogic {
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Lazy initializer runs client-side only after mount (we're 'use client'),
  // so reading sessionStorage here is safe and SSR/JS-off cases never show splash.
  const [isFirstSession] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return false;
    }
  });

  const [shouldShow, setShouldShow] = useState<boolean>(isFirstSession);
  const [appReady, setAppReady] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  // Minimum visible duration (shorter under reduced-motion).
  useEffect(() => {
    if (!isFirstSession) return;
    const duration = prefersReducedMotion ? REDUCED_MIN_MS : MIN_DURATION_MS;
    const timer = window.setTimeout(() => setMinTimeDone(true), duration);
    return () => window.clearTimeout(timer);
  }, [isFirstSession, prefersReducedMotion]);

  // Failsafe — never block the site for more than 4s under any circumstance.
  useEffect(() => {
    if (!isFirstSession) return;
    const safety = window.setTimeout(() => {
      setShouldShow(false);
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* storage unavailable — harmless */
      }
    }, SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(safety);
  }, [isFirstSession]);

  // Hide only when BOTH minimum time and app readiness have passed.
  useEffect(() => {
    if (!isFirstSession) return;
    if (appReady && minTimeDone) {
      setShouldShow(false);
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* storage unavailable — harmless */
      }
    }
  }, [appReady, minTimeDone, isFirstSession]);

  const markAppReady = () => setAppReady(true);

  return { shouldShow, isFirstSession, prefersReducedMotion, markAppReady };
}
