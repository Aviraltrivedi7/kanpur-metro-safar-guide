'use client';

import { useEffect, useRef, useState } from 'react';

export const SPLASH_ID = 'km-splash';

/** Dots along the splash rail — positions in the 400-wide viewBox. */
const RAIL_DOTS = [0, 88, 176, 264, 352, 400];

/**
 * PWA app launch splash — VISIBLE FROM THE FIRST FRAME.
 *
 * Why SSR markup + an inline head script: the previous version appended the
 * overlay in a mount effect, so the installed app painted the home page first
 * and the splash appeared on top a moment later ("home page, then splash").
 * Now the overlay ships inside the server-rendered HTML, and a tiny inline
 * script in <head> flags app launches (html.km-app-launch) BEFORE the first
 * paint.
 *
 *   - WEBSITE (normal browser tab): the flag is never set → CSS keeps the
 *     overlay display:none → React removes the never-visible node after
 *     mount. Zero splash on the website.
 *   - INSTALLED APP: the flag is set → the overlay is part of the first
 *     painted frame. After ~2.4s React fades it out and removes it; a
 *     pure-CSS safety animation hides it even if JS never loads.
 *   - Only runs on full page loads (app open). SPA navigation never
 *     re-triggers it — the root layout persists across client navigations
 *     and the effect guard is instance-level.
 */
export function SplashScreen() {
  const [show, setShow] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const w = window as Window & { navigator: Navigator & { standalone?: boolean } };
    const isAppLaunch =
      w.matchMedia('(display-mode: standalone)').matches ||
      w.matchMedia('(display-mode: fullscreen)').matches ||
      w.navigator.standalone === true;

    // Browser tab: strip the never-visible overlay out of the DOM.
    if (!isAppLaunch) {
      setShow(false);
      return;
    }

    const reduced =
      typeof w.matchMedia === 'function' &&
      w.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fadeTimer = w.setTimeout(() => {
      document.getElementById(SPLASH_ID)?.classList.add('km-splash-done');
      w.setTimeout(() => setShow(false), reduced ? 150 : 450);
    }, reduced ? 200 : 2400);

    return () => w.clearTimeout(fadeTimer);
  }, []);

  if (!show) return null;

  return (
    <div id={SPLASH_ID} role="status" aria-label="Kanpur Metro Safar Guide loading">
      <div className="km-s-inner">
        <div className="km-s-logo-glow">
          <img
            className="km-s-logo"
            src="/icons/logo-512.png"
            alt="Kanpur Metro Safar Guide logo"
            width={168}
            height={168}
            decoding="async"
          />
        </div>
        <div className="km-s-lockup">
          <p className="km-s-kicker">KANPUR METRO</p>
          <p className="km-s-title">Safar Guide</p>
        </div>
        <svg className="km-s-svg" viewBox="0 0 400 40" aria-hidden="true" focusable="false">
          <line className="km-s-line" x1={0} y1={20} x2={400} y2={20} />
          {RAIL_DOTS.map((cx, i) => (
            <circle
              key={cx}
              className="km-s-dot"
              style={{ animationDelay: `${(0.5 + i * 0.1).toFixed(2)}s` }}
              cx={cx}
              cy={20}
              r={i === 0 || i === RAIL_DOTS.length - 1 ? 7 : 5}
              fill="#1D4ED8"
            />
          ))}
          <g className="km-s-train">
            <rect x={-16} y={12} width={28} height={16} rx={4} fill="#F59E0B" />
            <rect x={-12} y={15} width={10} height={7} rx={2} fill="#ffffff" opacity={0.9} />
            <polygon points="12,20 16,17 16,23" fill="#F59E0B" />
          </g>
        </svg>
        <p className="km-s-tagline">Plan. Travel. Explore.</p>
      </div>
      <p className="km-s-credit">An independent project by Aviral Trivedi</p>
    </div>
  );
}
