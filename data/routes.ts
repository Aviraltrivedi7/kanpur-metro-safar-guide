/**
 * data/routes.ts
 *
 * Corridor 1 ordered station list + journey calculation.
 * Journeys are derived from station order — no hardcoded route pairs.
 */

import { CORRIDOR_1_ID, getStationById, operationalStations, Station } from './stations';

export interface Corridor {
  id: string;
  name: string;
  stationIds: string[];
}

/** Corridor 1 — IIT Kanpur ↔ Naubasta (operational segment: IIT Kanpur ↔ Kanpur Central). */
export const corridors: Corridor[] = [
  {
    id: CORRIDOR_1_ID,
    name: 'Corridor 1',
    stationIds: operationalStations.map((s) => s.id),
  },
];

export interface Journey {
  from: Station;
  to: Station;
  stations: Station[];
  stops: number;
  direction: Station;
  estimatedTimeMinutes: number | null; // null = estimate unavailable
  fareNote: string;
}

/** Average run time per inter-station segment. UNVERIFIED estimate. */
const MINUTES_PER_SEGMENT = 3; // UNVERIFIED

/**
 * Calculate a journey between two operational stations on Corridor 1.
 * Returns null when either station is unknown or not operational.
 */
export function calculateJourney(fromId: string, toId: string): Journey | null {
  const from = getStationById(fromId);
  const to = getStationById(toId);
  if (!from || !to) return null;
  if (from.status !== 'operational' || to.status !== 'operational') return null;

  const fromNum = from.stationNumber;
  const toNum = to.stationNumber;
  const stops = Math.abs(toNum - fromNum);

  const lo = Math.min(fromNum, toNum);
  const hi = Math.max(fromNum, toNum);
  const stationsOnPath = operationalStations.filter(
    (s) => s.stationNumber >= lo && s.stationNumber <= hi
  );

  // Direction = the terminal station the train is heading toward.
  const direction = toNum > fromNum ? operationalStations[operationalStations.length - 1] : operationalStations[0];

  return {
    from,
    to,
    stations: fromNum < toNum ? stationsOnPath : [...stationsOnPath].reverse(),
    stops,
    direction,
    estimatedTimeMinutes: stops === 0 ? 0 : stops * MINUTES_PER_SEGMENT, // UNVERIFIED estimate
    fareNote: 'Travel time is an estimate. Check live timings at the station.',
  };
}
