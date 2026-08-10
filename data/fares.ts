/**
 * data/fares.ts
 *
 * UPMRC Kanpur Metro fare slabs (publicly reported, verified: true).
 * Fare is determined by the number of stops travelled.
 * Never invent numbers outside this table.
 */

export interface FareSlab {
  minStops: number;
  maxStops: number; // use Infinity for the top slab
  fare: number; // in ₹
  verified: boolean;
}

/** Verified UPMRC slab table for Kanpur Metro. */
export const fareSlabs: FareSlab[] = [
  { minStops: 1, maxStops: 2, fare: 10, verified: true },
  { minStops: 3, maxStops: 4, fare: 15, verified: true },
  { minStops: 5, maxStops: 6, fare: 25, verified: true },
  { minStops: 7, maxStops: 8, fare: 30, verified: true },
  { minStops: 9, maxStops: 10, fare: 40, verified: true },
  { minStops: 11, maxStops: Infinity, fare: 50, verified: true },
];

export interface FareInfo {
  stops: number;
  fare: number | null; // null when stops is 0 or out of table
  verified: boolean;
  disclaimer: string;
}

export const FARE_DISCLAIMER =
  'Fares are as per publicly reported UPMRC slabs and may change. Verify at the station before travel.';

/**
 * Look up the fare for a given number of stops.
 * stops < 1 returns fare: null — no made-up numbers.
 */
export function calculateFare(stops: number): FareInfo {
  if (!Number.isFinite(stops) || stops < 1) {
    return { stops, fare: null, verified: false, disclaimer: FARE_DISCLAIMER };
  }
  const slab = fareSlabs.find((s) => stops >= s.minStops && stops <= s.maxStops);
  if (!slab) {
    return { stops, fare: null, verified: false, disclaimer: FARE_DISCLAIMER };
  }
  return { stops, fare: slab.fare, verified: slab.verified, disclaimer: FARE_DISCLAIMER };
}
