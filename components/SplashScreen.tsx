'use client';

import { useEffect, useRef } from 'react';

export const SPLASH_ID = 'km-splash';

/**
 * Startup splash — client-side controller with single-mount guarantee.
 *
 * CRITICAL FIX: React re-renders the layout on every SPA navigation and, if
 * the splash were still a server-side `dangerouslySetInnerHTML` div, React
 * would re-inject it into the DOM on every page change. This component
 * instead:
 *   1. Renders null by itself (no SSR HTML).
 *   2. On MOUNT ONLY (first app mount, useRef guard), checks localStorage.
 *   3. If this device has NEVER seen the splash: renders + animates the
 *      shell, marks localStorage, then removes it after the animation.
 *   4. If seen before, or on any SPA re-render: does nothing — the splash
 *      never reappears, the app never flashes white.
 *
 * Because the mount guard is instance-level (useRef), Next.js layout
 * re-renders on navigation cannot trigger it again.
 */
export function SplashScreen() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let shown = true;
    try {
      shown = !!window.localStorage.getItem('km_splash_shown');
    } catch {
      /* storage blocked → treat as shown, never trap the user */
    }
    if (shown) return;

    // Very first start on this device (or after user cleared storage).
    try {
      window.localStorage.setItem('km_splash_shown', '1');
    } catch {
      /* continue even if we can't persist; still show the splash */
    }

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build the splash element.
    const el = document.createElement('div');
    el.id = SPLASH_ID;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Kanpur Metro Safar Guide loading');

    const dots = [0, 88, 176, 264, 352, 400]
      .map(
        (cx, i) =>
          `<circle class="km-s-dot" style="animation-delay:${(0.5 + i * 0.1).toFixed(2)}s" cx="${cx}" cy="20" r="${i === 0 || i === 5 ? 7 : 5}" fill="#1D4ED8"/>`
      )
      .join('');

    el.innerHTML =
      '<div class="km-s-inner">' +
      '<div class="km-s-logo-glow">' +
      '<img class="km-s-logo" src="/logo.png" alt="Kanpur Metro Safar Guide logo" width="168" height="168" />' +
      '</div>' +
      '<div class="km-s-lockup">' +
      '<p class="km-s-kicker">KANPUR METRO</p>' +
      '<p class="km-s-title">Safar Guide</p>' +
      '</div>' +
      '<svg class="km-s-svg" viewBox="0 0 400 40" aria-hidden="true" focusable="false">' +
      '<line class="km-s-line" x1="0" y1="20" x2="400" y2="20"/>' +
      dots +
      '<g class="km-s-train">' +
      '<rect x="-16" y="12" width="28" height="16" rx="4" fill="#F59E0B"/>' +
      '<rect x="-12" y="15" width="10" height="7" rx="2" fill="#ffffff" opacity="0.9"/>' +
      '<polygon points="12,20 16,17 16,23" fill="#F59E0B"/>' +
      '</g>' +
      '</svg>' +
      '<p class="km-s-tagline">Plan. Travel. Explore.</p>' +
      '</div>' +
      '<p class="km-s-credit">An independent project by Aviral Trivedi</p>';

    document.body.appendChild(el);

    // After min duration (or immediately on reduced-motion) fade it out.
    const minMs = reduced ? 0 : 2200;
    const removeTimer = window.setTimeout(() => {
      el.classList.add('km-splash-done');
      window.setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, reduced ? 150 : 450);
    }, minMs);

    return () => {
      window.clearTimeout(removeTimer);
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  return null;
}
