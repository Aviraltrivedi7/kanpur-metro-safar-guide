'use client';

/**
 * components/alerts/ServiceAlerts.tsx
 *
 * Phase 12 — dismissible service alerts. In SCHEDULE mode there is no
 * disruption feed, so this renders nothing except a static informational
 * note once per session. When a live provider is wired it will surface
 * active alerts here automatically.
 */

import { Info, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { metroService } from '@/services/MetroService';
import type { ServiceAlert } from '@/services/providers/types';

const SESSION_KEY = 'kmsg:dismissed-alerts';

function readDismissed(): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeDismissed(ids: string[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable — dismissals just won't persist this session
  }
}

export function ServiceAlerts() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setDismissed(readDismissed());
    let active = true;
    void metroService
      .getAlerts()
      .then((list) => {
        if (active) setAlerts(list.filter((a) => a.active));
      })
      .catch(() => {
        /* alerts are best-effort */
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => alerts.filter((a) => !dismissed.includes(a.id)),
    [alerts, dismissed]
  );

  if (visible.length === 0) return null;

  return (
    <ul className="space-y-2" aria-label="Service alerts">
      {visible.map((alert) => (
        <li
          key={alert.id}
          className={`card flex items-start gap-3 border-l-4 p-4 ${
            alert.severity === 'critical'
              ? 'border-l-disruption'
              : alert.severity === 'warning'
                ? 'border-l-delayed'
                : 'border-l-metro-blue'
          }`}
          role="alert"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{alert.title}</p>
            <p className="mt-0.5 text-sm text-muted">{alert.body}</p>
          </div>
          <button
            type="button"
            aria-label={`Dismiss alert: ${alert.title}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface"
            onClick={() => {
              setDismissed((prev) => {
                const next = [...prev, alert.id];
                writeDismissed(next);
                return next;
              });
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
