/**
 * components/splash/startupSplash.ts
 *
 * HTML startup shell — the splash markup that is SERVER-RENDERED directly
 * into the document (before React hydrates). This is what guarantees the
 * splash is the very FIRST paint: no homepage/navbar/hero flash is possible
 * because the app content sits under `#km-app-root` (visibility:hidden) until
 * React marks the app ready and removes the splash.
 *
 * There is exactly ONE splash: this HTML shell. React (SplashScreen) only
 * controls its removal/timing — it never renders a second splash.
 */

export const SPLASH_ID = 'km-splash';
export const APP_ROOT_ID = 'km-app-root';
export const SPLASH_SESSION_KEY = 'km_splash_shown';

// Station positions along the line (percent of 400-wide viewBox).
const STATIONS: ReadonlyArray<{ cx: number; r: number }> = [
  { cx: 0, r: 7 },
  { cx: 88, r: 5 },
  { cx: 176, r: 5 },
  { cx: 264, r: 5 },
  { cx: 352, r: 5 },
  { cx: 400, r: 7 },
];

/**
 * The full splash overlay HTML. Pure CSS animations (globals.css) so it
 * animates from first paint with ZERO JavaScript.
 * Server-side: always included. Client logic removes it for repeat loads
 * (via the hidden-inline script before hydration / SplashScreen after).
 */
export function StartupSplashMarkup() {
  const dots = STATIONS.map(
    (s, i) =>
      `<circle class="km-s-dot" style="animation-delay:${(0.5 + i * 0.1).toFixed(2)}s" cx="${s.cx}" cy="20" r="${s.r}" fill="#1D4ED8"/>`
  ).join('');

  return (
    `<div id="${SPLASH_ID}" role="status" aria-label="Kanpur Metro Safar Guide loading">` +
    '<div class="km-s-inner">' +
    '<svg class="km-s-svg" viewBox="0 0 400 40" aria-hidden="true" focusable="false">' +
    '<line class="km-s-line" x1="0" y1="20" x2="400" y2="20"/>' +
    dots +
    '<g class="km-s-train">' +
    '<rect x="-16" y="12" width="28" height="16" rx="4" fill="#F59E0B"/>' +
    '<rect x="-12" y="15" width="10" height="7" rx="2" fill="#ffffff" opacity="0.9"/>' +
    '<polygon points="12,20 16,17 16,23" fill="#F59E0B"/>' +
    '</g>' +
    '</svg>' +
    '<p class="km-s-kicker">KANPUR METRO</p>' +
    '<p class="km-s-title">Safar Guide</p>' +
    '<p class="km-s-tagline">Plan. Travel. Explore.</p>' +
    '</div>' +
    '<p class="km-s-credit">An independent project by Aviral Trivedi</p>' +
    '</div>'
  );
}

/** Pre-hydration script: hides the splash instantly on repeat loads in the
 * same tab session (before first paint), sets up the 4s JS-failure failsafe,
 * and removes the splash + reveals the app when React signals completion. */
export const STARTUP_SCRIPT = `(function(){var S='${SPLASH_SESSION_KEY}';var el=document.getElementById('${SPLASH_ID}');if(!el)return;var root=document.getElementById('${APP_ROOT_ID}');var done=false;try{if(window.sessionStorage.getItem(S)){el.parentNode.removeChild(el);if(root)root.style.visibility='visible';done=true;}}catch(e){}if(done)return;window.__kmAppReady=function(){if(done)return;done=true;try{window.sessionStorage.setItem(S,'1');}catch(e){}var s=document.getElementById('${SPLASH_ID}');if(s){s.classList.add('km-splash-done');setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},700);}var r=document.getElementById('${APP_ROOT_ID}');if(r)r.style.visibility='visible';};setTimeout(function(){window.__kmAppReady();},4000);})();`;

/** Removes the splash when JavaScript is disabled entirely. */
export const NOSCRIPT_STYLE = `<noscript><style>#${SPLASH_ID}{display:none!important}#${APP_ROOT_ID}{visibility:visible!important}</style></noscript>`;

/**
 * Server component that injects the startup splash + its control script.
 * Rendered as the FIRST child of <body> so it is painted before anything else.
 */
export function StartupShell() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: StartupSplashMarkup() }} />
      <script dangerouslySetInnerHTML={{ __html: STARTUP_SCRIPT }} />
      <div dangerouslySetInnerHTML={{ __html: NOSCRIPT_STYLE }} />
    </>
  );
}
