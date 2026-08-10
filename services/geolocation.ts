/**
 * services/geolocation.ts
 *
 * Feature 1 — nearest-station math.
 * Pure functions, no browser APIs here: the component owns the
 * navigator.geolocation call (triggered ONLY on explicit button click).
 */

import { getStationCoordinate } from '@/data/station-coordinates';
import { operationalStations, type Station } from '@/services/metro';

export interface NearestStation {
  station: Station;
  /** Straight-line (haversine) distance in km. */
  distanceKm: number;
  /** Approximate walking time: Math.ceil(km × 12). */
  walkMinutes: number;
}

/** Great-circle distance in km between two lat/lng points. */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Rough walking estimate: ~5 km/h → 12 minutes per km, always rounded up. */
export function walkingMinutes(distanceKm: number): number {
  return Math.ceil(distanceKm * 12);
}

/**
 * Find the nearest operational station to a position.
 * Returns null when coordinates are unavailable (consent rules forbid
 * shipping unverifiable station coordinates silently — the caller must
 * handle the null case with a friendly message).
 */
export function findNearestStation(lat: number, lng: number): NearestStation | null {
  let best: NearestStation | null = null;
  for (const station of operationalStations) {
    const coord = getStationCoordinate(station.id);
    if (!coord) continue;
    const distanceKm = haversineDistanceKm(lat, lng, coord.lat, coord.lng);
    if (!best || distanceKm < best.distanceKm) {
      best = { station, distanceKm, walkMinutes: walkingMinutes(distanceKm) };
    }
  }
  return best;
}

/** Google Maps walking-directions URL for a station. */
export function googleMapsDirectionsUrl(stationId: string): string | null {
  const coord = getStationCoordinate(stationId);
  if (!coord) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${coord.lat},${coord.lng}&travelmode=walking`;
}
