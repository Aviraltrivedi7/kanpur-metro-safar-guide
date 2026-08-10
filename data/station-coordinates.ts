/**
 * data/station-coordinates.ts
 *
 * Geographic coordinates for the 14 operational Corridor 1 stations.
 * Sources: public Google Maps / OpenStreetMap listings for Kanpur Metro
 * Phase 1 stations. // UNVERIFIED — confirm against official UPMRC station
 * data before relying on these for navigation. Distances shown to users
 * must always be labelled "approximate".
 */

export interface StationCoordinate {
  lat: number;
  lng: number;
}

export const STATION_COORDINATES: Record<string, StationCoordinate> = {
  'iit-kanpur': { lat: 26.5109, lng: 80.2319 }, // UNVERIFIED
  kalyanpur: { lat: 26.5051, lng: 80.2463 }, // UNVERIFIED
  'spm-hospital': { lat: 26.4983, lng: 80.2648 }, // UNVERIFIED
  vishwavidyalaya: { lat: 26.4926, lng: 80.2745 }, // UNVERIFIED
  'gurudev-chauraha': { lat: 26.4858, lng: 80.2847 }, // UNVERIFIED
  'geeta-nagar': { lat: 26.4795, lng: 80.2925 }, // UNVERIFIED
  rawatpur: { lat: 26.4756, lng: 80.2998 }, // UNVERIFIED
  'llr-hospital': { lat: 26.4693, lng: 80.3116 }, // UNVERIFIED
  'moti-jheel': { lat: 26.4664, lng: 80.3193 }, // UNVERIFIED
  chunniganj: { lat: 26.4628, lng: 80.3315 }, // UNVERIFIED
  'naveen-market': { lat: 26.4613, lng: 80.339 }, // UNVERIFIED
  'bada-chauraha': { lat: 26.4592, lng: 80.3456 }, // UNVERIFIED
  nayaganj: { lat: 26.4557, lng: 80.3483 }, // UNVERIFIED
  'kanpur-central': { lat: 26.4499, lng: 80.3319 }, // UNVERIFIED
};

export function getStationCoordinate(stationId: string): StationCoordinate | null {
  return STATION_COORDINATES[stationId] ?? null;
}
