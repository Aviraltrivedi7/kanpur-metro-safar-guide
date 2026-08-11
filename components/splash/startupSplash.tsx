/**
 * components/splash/startupSplash.tsx
 *
 * HTML startup shell — the splash markup that is SERVER-RENDERED directly
 * into the document (before React hydrates). This is what guarantees the
 * splash is the very FIRST paint: no homepage/navbar/hero flash is possible
 * because the app content sits under `#km-app-root` (visibility:hidden,
 * gated behind [data-splash-active]) until the startup script reveals it.
 *
 * There is exactly ONE splash: this HTML shell. React (SplashScreen) only
 * controls its removal/timing — it never renders a second splash.
 *
 * Visibility mechanism (permanent, hydration-safe):
 *   - CSS rule ONLY applies: html[data-splash-active] #km-app-root { visibility:hidden }
 *   - The pre-body inline script sets data-splash-active + .km-splash-on AT
 *     PARSE TIME only when the splash will actually show (already-shown
 *     sessions get NO hiding — zero flash, zero white screen).
 *   - The post-app script marks shown, reveals via class (React never touches
 *     class attributes, so hydration can never undo the reveal), and removes
 *     the splash. On SPA navigations the shell isn't in the DOM — nothing runs.
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
 * Inline PRE script — runs while <head> is being parsed, BEFORE the body
 * (and therefore before #km-app-root) exists. Decides whether this page
 * view shows the splash at all:
 *   - Repeat load this session → do nothing → CSS never hides the app →
 *     pages (and SPA navigations) show content instantly, zero white screen.
 *   - Fresh load / new tab / hard refresh → mark documentElement so CSS
 *     hides the app root from the FIRST paint.
 */
export const STARTUP_PRE_SCRIPT = `(function(){try{if(!window.sessionStorage.getItem('${SPLASH_SESSION_KEY}')){var d=document.documentElement;d.setAttribute('data-splash-active','');d.classList.add('km-splash-on');}}catch(e){}})();`;

/**
 * The splash overlay HTML. Pure CSS animations (globals.css) so it animates
 * from first paint with ZERO JavaScript. Server-side: always included; the
 * post-body script removes it immediately for repeat loads.
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

/**
 * Inline POST script — rendered right AFTER #km-app-root. Handles:
 *   - already-shown sessions: removes the splash immediately
 *   - fresh loads: marks sessionStorage NOW (so any same-tab reload or
 *     navigate-away-and-back skips the splash even if the user clicked
 *     during the splash), defines the failsafe __kmAppReady + 4s timeout.
 *     React (SplashScreen) will call __kmAppReady when the app is ready
 *     AND the minimum animation duration has elapsed.
 */
export const STARTUP_POST_SCRIPT = `(function(){var S='${SPLASH_SESSION_KEY}';var el=document.getElementById('${SPLASH_ID}');var d=document.documentElement;var shown=false;try{shown=!!window.sessionStorage.getItem(S);}catch(e){}if(shown||!el){if(el&&el.parentNode)el.parentNode.removeChild(el);return;}function finish(){var s=document.getElementById('${SPLASH_ID}');d.removeAttribute('data-splash-active');d.classList.remove('km-splash-on');if(s){s.classList.add('km-splash-done');setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},700);}}if(typeof window.__kmAppReady!=='function'){var done=false;try{window.sessionStorage.setItem(S,'1');}catch(e){}window.__kmAppReady=function(){if(done)return;done=true;finish();};setTimeout(function(){window.__kmAppReady();},4000);}})();`;

/** Removes the splash + reveals the app when JavaScript is disabled entirely. */
export const NOSCRIPT_STYLE = `<noscript><style>#${SPLASH_ID}{display:none!important}#${APP_ROOT_ID}{visibility:visible!important}</style></noscript>`;

/** Server component: head-area pre-body decision script. */
export function StartupHead() {
  return <script dangerouslySetInnerHTML={{ __html: STARTUP_PRE_SCRIPT }} />;
}

/** Server component: the splash shell itself, first child of <body>. */
export function StartupShell() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: StartupSplashMarkup() }} />
      <div dangerouslySetInnerHTML={{ __html: NOSCRIPT_STYLE }} />
    </>
  );
}

/** Server component: rendered AFTER the app root; fixes parse-time races. */
export function StartupTail() {
  return <script dangerouslySetInnerHTML={{ __html: STARTUP_POST_SCRIPT }} />;
}
