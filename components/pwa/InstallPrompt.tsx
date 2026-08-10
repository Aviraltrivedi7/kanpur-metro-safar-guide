'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Spec: show install prompt only after ~30s, not immediately.
      setTimeout(() => setVisible(true), 30_000);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="fixed left-4 right-4 z-50 sm:left-auto sm:right-6 sm:w-80 card p-4 shadow-elevated"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">Install Metro Safar Guide</p>
        <button
          type="button"
          aria-label="Dismiss install prompt"
          className="btn btn-secondary h-11 w-11 shrink-0 p-0"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">Quick access from your home screen — works offline.</p>
      <button
        type="button"
        className="btn btn-primary mt-3 h-11 w-full text-sm"
        onClick={async () => {
          await deferred.prompt();
          await deferred.userChoice;
          setVisible(false);
          setDeferred(null);
        }}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Install
      </button>
    </div>
  );
}
