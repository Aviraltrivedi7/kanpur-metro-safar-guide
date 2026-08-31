/**
 * Analytics stub.
 * Features call trackEvent() with a name + small payload; while no analytics
 * provider is configured, events are a no-op in production and log in dev.
 * Wire a real provider (e.g. PostHog, Plausible) here without touching callers.
 */

export type TrackEventName =
  | 'journey_planned'
  | 'journey_saved'
  | 'share_clicked'
  | 'shared_journey_opened'
  | 'return_visit'
  | 'travel_mode_started'
  | 'near_me_used'
  | 'install_prompt_shown'
  | 'install_prompt_dismissed'
  | 'install_prompt_accepted';

export function trackEvent(name: TrackEventName, payload?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info('[trackEvent]', name, payload ?? {});
  }
}
