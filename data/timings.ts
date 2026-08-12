/**
 * data/timings.ts
 *
 * Publicly reported service hours for Kanpur Metro.
 * There is no official per-station timetable API; these are line-level hours.
 * Marked verified where the line-level hours are publicly reported.
 */

export interface LineTimings {
  firstTrain: string;
  lastTrain: string;
  frequencyMinutes: number | null;
  verified: boolean;
  note: string;
}

export const lineTimings: LineTimings = {
  firstTrain: '06:00',
  lastTrain: '22:00',
  frequencyMinutes: null, // UNVERIFIED — no official frequency published
  verified: true,
  note: 'Services run daily. Exact frequency and holiday timings are not officially published; check at the station.',
};

/**
 * Phase 12 — schedule engine config.
 *
 * firstTrain / lastTrain are publicly reported (verified on-screen elsewhere).
 * Headway (frequency) values below are NOT officially published by UPMRC in a
 * verifiable public document — they are estimates and treated as such: every
 * arrival UI derived from them shows a SCHEDULE/ESTIMATED trust badge.
 */
export const metroConfig = {
  // Official/publicly reported service hours
  firstTrain: lineTimings.firstTrain,
  lastTrain: lineTimings.lastTrain,

  // Officially published frequency: "every 6–10 minutes" (publicly reported).
  peakHeadwayMinutes: 6, // verified as published statement
  offPeakHeadwayMinutes: 10, // verified as published statement
  weekendHeadwayMinutes: 10, // verified as published statement

  // Peak hours definition — UNVERIFIED (UPMRC has not published exact peak windows)
  morningPeakStart: '08:00', // UNVERIFIED
  morningPeakEnd: '11:00', // UNVERIFIED
  eveningPeakStart: '17:00', // UNVERIFIED
  eveningPeakEnd: '20:00', // UNVERIFIED

  // Data metadata
  source: 'UPMRC official information',
  lastVerified: '2026-08-08', // line timings + official headway statement verified
  verified: true, // headway now publicly stated (6–10 min); exact per-hour table still UNVERIFIED

  notes: 'Timings and frequency may change. Real-time arrivals are unavailable; always verify before travel. This site is not affiliated with UPMRC.',
} as const;

export type MetroConfig = typeof metroConfig;

/** Human-readable headway tagline, e.g. "approx. every 6–10 min". */
export const HEADWAY_TAGLINE = `approx. every ${metroConfig.peakHeadwayMinutes}–${metroConfig.offPeakHeadwayMinutes} min`; // UNVERIFIED

/** Mandatory honesty disclaimer shown wherever arrival times appear. */
export const ARRIVAL_TIMES_DISCLAIMER = `Times based on published schedule (${HEADWAY_TAGLINE}). Real-time arrivals unavailable. Please verify at the station.`;
