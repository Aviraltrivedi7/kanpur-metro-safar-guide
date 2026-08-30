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
      '<line x1="1.5" y1="14" x2="7.5" y2="14" stroke="url(#sp-a)" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>' +
      '<line x1="3" y1="19" x2="8" y2="19" stroke="url(#sp-a)" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>' +
      '<line x1="1.5" y1="24" x2="7.5" y2="24" stroke="url(#sp-a)" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>' +
      '<path d="M13 9 H32 Q40 9 43 17 V26 Q43 31 38 31 H13 Q9 31 9 27 V13 Q9 9 13 9 Z" fill="url(#sp-b)"/>' +
      '<path d="M32.5 12.5 Q37.5 12.5 40.3 17.8 V20.5 H32.5 Z" fill="#0F172A" opacity="0.88"/>' +
      '<rect x="13.5" y="13" width="8" height="6.5" rx="2" fill="white" opacity="0.92"/>' +
      '<rect x="24" y="13" width="6.5" height="6.5" rx="2" fill="white" opacity="0.92"/>' +
      '<rect x="11" y="25" width="29" height="3.2" rx="1.6" fill="url(#sp-a)"/>' +
      '<circle cx="16" cy="32" r="2.8" fill="#334155" stroke="#94A3B8" stroke-width="0.9"/>' +
      '<circle cx="16" cy="32" r="1.05" fill="#FBBF24"/>' +
      '<circle cx="34" cy="32" r="2.8" fill="#334155" stroke="#94A3B8" stroke-width="0.9"/>' +
      '<circle cx="34" cy="32" r="1.05" fill="#FBBF24"/>' +
      '<rect x="4" y="35" width="40" height="2.6" rx="1.3" fill="url(#sp-a)" opacity="0.85"/>' +
      '<rect x="7" y="39" width="3.2" height="2" rx="0.8" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="17" y="39" width="3.2" height="2" rx="0.8" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="27" y="39" width="3.2" height="2" rx="0.8" fill="#F59E0B" opacity="0.45"/>' +
      '<rect x="37" y="39" width="3.2" height="2" rx="0.8" fill="#F59E0B" opacity="0.45"/>' +
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
