'use client';

/**
 * components/pwa/InstallPrompt.tsx
 *
 * Feature 5 — PWA install prompt.
 *
 * Behaviour (per project request):
 *   - Shows the install card ~5s after arrival and REAPPEARS EVERY 2 MINUTES
 *     until the user actually installs the app. Dismissing only hides it for
 *     the current 2-minute window (a persistent nudge, not a one-shot popup).
 *   - On browsers that expose the native install dialog (Chrome/Edge/Android
 *     via beforeinstallprompt) the primary button triggers that dialog.
 *   - On browsers without it (iOS Safari, Firefox) the card instead shows
 *     step-by-step install instructions, so the prompt is useful everywhere.
 *   - Once installed (display-mode: standalone), the card never appears again.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Share, SquarePlus, X, Smartphone } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Kept narrow — these are the only window fields we read. */
type InstallWindow = Window & {
  navigator: Navigator & { standalone?: boolean };
};

const SHOW_DELAY_MS = 5_000;
const REAPPEAR_INTERVAL_MS = 120_000; // 2 minutes
const IS_IOS_PATTERN = /iphone|ipad|ipod/i;

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [supportsNative, setSupportsNative] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const w = window as InstallWindow;

    // Already installed → never show the prompt.
    const standalone =
      w.matchMedia('(display-mode: standalone)').matches ||
      w.matchMedia('(display-mode: fullscreen)').matches ||
      w.navigator.standalone === true;
    setIsStandalone(standalone);

    setIsIOS(IS_IOS_PATTERN.test(w.navigator.userAgent));

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setSupportsNative(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  // Visibility cycle: first show after SHOW_DELAY_MS, then again every 2 min.
  useEffect(() => {
    if (isStandalone) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      trackEvent('install_prompt_shown');
    }, SHOW_DELAY_MS);

    cycleRef.current = setInterval(() => {
      setVisible(true);
      trackEvent('install_prompt_shown');
    }, REAPPEAR_INTERVAL_MS);

    return () => {
      clearTimeout(showTimer);
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [isStandalone]);

  const dismiss = useCallback(() => {
    setVisible(false);
    trackEvent('install_prompt_dismissed');
  }, []);

  async function handleInstall() {
    trackEvent('install_prompt_accepted');
    if (deferred) {
      try {
        await deferred.prompt();
        const { outcome } = await deferred.userChoice;
        if (outcome === 'accepted') {
          setDeferred(null);
          setSupportsNative(false);
        }
      } catch {
        /* native dialog failed — instructions card stays as the fallback */
      }
    }
  }

  if (!visible || isStandalone) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="card km-panel-in fixed left-4 right-4 z-50 p-4 shadow-elevated sm:left-auto sm:right-6 sm:w-96"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Smartphone className="h-4 w-4 text-metro-blue" aria-hidden="true" />
          Install Metro Safar Guide
        </p>
        <button
          type="button"
          aria-label="Dismiss install prompt"
          className="btn btn-secondary h-11 w-11 shrink-0 p-0"
          onClick={dismiss}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">
        Works offline · Full-screen app · Har jagah se quick access
      </p>

      {supportsNative && deferred ? (
        <button
          type="button"
          className="btn btn-primary mt-3 h-11 w-full text-sm"
          onClick={handleInstall}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Install App
        </button>
      ) : (
        <div className="mt-3 rounded-md bg-surface p-3 text-xs leading-relaxed">
          {isIOS ? (
            <ol className="list-decimal space-y-1.5 pl-4">
              <li>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Share className="h-3.5 w-3.5 inline" aria-hidden="true" /> Share
                </span>{' '}
                button dabayein (bottom toolbar)
              </li>
              <li>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <SquarePlus className="h-3.5 w-3.5 inline" aria-hidden="true" /> Add to Home
                  Screen
                </span>{' '}
                chunein
              </li>
              <li>
                <strong>Add</strong> dabayein — app icon home screen pe aa jayega
              </li>
            </ol>
          ) : (
            <ol className="list-decimal space-y-1.5 pl-4">
              <li>
                Browser menu (<strong>⋮</strong> ya <strong>☰</strong>) kholein
              </li>
              <li>
                <strong>Install app</strong> ya <strong>Add to Home screen</strong> chunein
              </li>
              <li>Confirm kar dein — app install ho jayega</li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
