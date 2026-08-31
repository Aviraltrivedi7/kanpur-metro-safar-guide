'use client';

import { useEffect, useRef } from 'react';

export const SPLASH_ID = 'km-splash';

/**
 * PWA app launch splash — shown ONLY when the site runs as an installed app
 * (standalone/fullscreen display mode, or iOS navigator.standalone).
 *
 * Rules:
 *   - WEBSITE (normal browser tab): never shows anything. Zero splash.
 *   - INSTALLED APP: branded launch splash on EVERY launch, exactly like a
 *     native app — the OS manifest splash hands off to this animated one.
 *
 * Rendering strategy (unchanged from the original design):
 *   1. Renders null by itself (no SSR HTML, nothing paint-blocking).
 *   2. On MOUNT ONLY (useRef guard) checks the display mode, then builds and
 *      appends the overlay imperatively and removes it after the animation.
 *   3. Instance-level mount guard means Next.js layout re-renders on SPA
 *      navigation can never re-trigger it.
 */
export function SplashScreen() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Installed-app detection: Android/desktop uses display-mode, iOS A2HS
    // exposes navigator.standalone.
    const isAppLaunch =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!isAppLaunch) return;

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
      '<img class="km-s-logo" src="/icons/logo-512.png" alt="Kanpur Metro Safar Guide logo" width="168" height="168" decoding="async" />' +
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
    const minMs = reduced ? 0 : 2400;
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
