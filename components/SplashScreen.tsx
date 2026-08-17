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
      '<svg class="km-s-logo" viewBox="0 0 48 48" fill="none" width="144" height="144" role="img" aria-label="Kanpur Metro Safar Guide logo">' +
      '<defs>' +
      '<linearGradient id="sp-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#1D4ED8"/></linearGradient>' +
      '<linearGradient id="sp-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#FBBF24"/><stop offset="100%" stop-color="#F59E0B"/></linearGradient>' +
      '</defs>' +
      '<line x1="2" y1="15" x2="9" y2="15" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>' +
      '<line x1="4" y1="21" x2="11" y2="21" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>' +
      '<line x1="2" y1="27" x2="9" y2="27" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>' +
      '<rect x="12" y="8" width="26" height="24" rx="5" fill="url(#sp-b)"/>' +
      '<path d="M38 8 Q44 8 44 20 Q44 32 38 32" fill="url(#sp-b)"/>' +
      '<rect x="15" y="12" width="6" height="7" rx="1.5" fill="white" opacity="0.92"/>' +
      '<rect x="23" y="12" width="6" height="7" rx="1.5" fill="white" opacity="0.92"/>' +
      '<rect x="31" y="12" width="6" height="7" rx="1.5" fill="white" opacity="0.92"/>' +
      '<line x1="22" y1="8" x2="22" y2="32" stroke="white" stroke-width="0.8" opacity="0.12"/>' +
      '<line x1="30" y1="8" x2="30" y2="32" stroke="white" stroke-width="0.8" opacity="0.12"/>' +
      '<rect x="12" y="28" width="26" height="3.5" rx="1.5" fill="url(#sp-a)"/>' +
      '<rect x="3" y="38" width="42" height="2.5" rx="1.25" fill="url(#sp-a)" opacity="0.7"/>' +
      '<rect x="8" y="41.5" width="3" height="2" rx="1" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="18" y="41.5" width="3" height="2" rx="1" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="28" y="41.5" width="3" height="2" rx="1" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="38" y="41.5" width="3" height="2" rx="1" fill="#F59E0B" opacity="0.45"/>' +
      '</svg>' +
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
