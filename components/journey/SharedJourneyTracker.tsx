'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Feature 10 (growth loop) — fires once when a user lands on a journey page
 * via a prefilled from/to link (i.e. a shared journey opened by a friend ✓).
 */
export function SharedJourneyTracker() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') && params.get('to')) {
      trackEvent('shared_journey_opened', {
        from: params.get('from') ?? '',
        to: params.get('to') ?? '',
      });
    }
  }, []);
  return null;
}
