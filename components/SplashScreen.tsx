'use client';

import { useEffect } from 'react';

const SESSION_KEY = 'km_splash_shown';
const SPLASH_ID = 'km-splash';
const MIN_DURATION_MS = 2200;
const REDUCED_MIN_MS = 400;
const REMOVAL_TIMEOUT_MS = 6000;

/**
 * Startup-splash controller.
 *
 * The splash itself is the server-rendered HTML startup shell (#km-splash),
 * which is on screen from the very first paint — BEFORE React loads. This
 * component NEVER renders its own splash. It only controls WHEN the shell
 * exits:
 *
 *   hide = minimum duration elapsed  AND  app is ready (first painted frame)
 *
 * Plus a 4s inline-script failsafe (in the shell) and a 6s React-side
 * removal failsafe. On repeat loads within the same tab session the shell
 * is removed pre-hydration by the inline script, so users only see the
 * splash on a fresh load / new tab / hard refresh — never on SPA navigation.
 */
export function SplashScreen() {
  useEffect(() => {
    let cancelled = false;

    function removeSplash(): void {
      const s = document.getElementById(SPLASH_ID);
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }

    function finish(): void {
      if (cancelled) return;
      if (typeof window.__kmAppReady === 'function') {
        window.__kmAppReady();
      } else {
        removeSplash();
      }
    }

    // Already shown this session? Ensure shell is gone immediately.
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) {
        removeSplash();
        return undefined;
      }
    } catch {
      /* storage unavailable — continue */
    }

    if (!document.getElementById(SPLASH_ID)) return undefined;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduced ? REDUCED_MIN_MS : MIN_DURATION_MS;

    let appReady = false;
    let minDone = false;
    let inner = 0;
    let minTimer = 0;
    let removalTimer = 0;

    function tryHide(): void {
      if (appReady && minDone) finish();
    }

    // App scope is the whole document body (everything between the shell and
    // the JSON-LD script). Double-RAF = after first real painted frame.
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        appReady = true;
        tryHide();
      });
    });

    minTimer = window.setTimeout(() => {
      minDone = true;
      tryHide();
    }, minMs);

    // React-side removal failsafe (inline script has its own 4s failsafe too).
    removalTimer = window.setTimeout(removeSplash, REMOVAL_TIMEOUT_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(minTimer);
      window.clearTimeout(removalTimer);
    };
  }, []);

  return null;
}
