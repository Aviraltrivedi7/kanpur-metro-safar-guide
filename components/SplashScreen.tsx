'use client';

import { useEffect } from 'react';

const SPLASH_ID = 'km-splash';
const REMOVAL_TIMEOUT_MS = 6000;

/**
 * Startup-splash controller.
 *
 * The splash itself is the server-rendered HTML startup shell (#km-splash),
 * on screen from the very first paint. This component NEVER renders its own
 * splash — it only decides WHEN the shell exits:
 *
 *   hide  =  minimum duration elapsed  AND  app is ready (first painted frame)
 *
 * The session marking happens in the inline POST script at page parse time,
 * so by the time this effect runs the shell exists only if this is a fresh
 * (not-yet-shown-this-session) load — a plain `getElementById` check is
 * enough, no sessionStorage re-read required.
 */
export function SplashScreen() {
  useEffect(() => {
    if (!document.getElementById(SPLASH_ID)) return;

    let cancelled = false;

    function removeSplash(): void {
      const s = document.getElementById(SPLASH_ID);
      if (s && s.parentNode) s.parentNode.removeChild(s);
      document.documentElement.removeAttribute('data-splash-active');
      document.documentElement.classList.remove('km-splash-on');
    }

    function finish(): void {
      if (cancelled) return;
      if (typeof window.__kmAppReady === 'function') {
        window.__kmAppReady();
      } else {
        removeSplash();
      }
    }

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let appReady = false;
    let minDone = false;
    let inner = 0;

    function tryHide(): void {
      if (appReady && minDone) finish();
    }

    // Double-RAF = after the first real painted frame of the app.
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        appReady = true;
        tryHide();
      });
    });

    // No minimum duration on reduced motion — the shell's CSS animations are
    // already ~instant, so hide as soon as the first frame is painted.
    const minMs = reduced ? 0 : 2200;
    const minTimer = window.setTimeout(() => {
      minDone = true;
      tryHide();
    }, minMs);

    // React-side removal failsafe (the inline script has its own 4s failsafe).
    const removalTimer = window.setTimeout(removeSplash, REMOVAL_TIMEOUT_MS);

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
