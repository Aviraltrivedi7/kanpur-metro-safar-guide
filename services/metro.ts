/**
 * services/metro.ts
 *
 * Single barrel file re-exporting the whole data layer.
 * Import from here everywhere in the app.
 */

export {
  stations,
  operationalStations,
  upcomingStations,
  OPERATIONAL_STATION_COUNT,
  CORRIDOR_1_ID,
  getStationById,
  searchStations,
  type Station,
  type StationType,
  type StationStatus,
  type StationFacilities,
} from '@/data/stations';

export {
  corridors,
  calculateJourney,
  type Corridor,
  type Journey,
} from '@/data/routes';

export {
  fareSlabs,
  calculateFare,
  FARE_DISCLAIMER,
  type FareSlab,
  type FareInfo,
} from '@/data/fares';

export {
  lineTimings,
  metroConfig,
  HEADWAY_TAGLINE,
  ARRIVAL_TIMES_DISCLAIMER,
  type LineTimings,
  type MetroConfig,
} from '@/data/timings';

export {
  getNetworkStatus,
  type NetworkStatus,
  type NetworkState,
} from '@/data/status';

export {
  landmarks,
  getLandmarkById,
  getLandmarksByCategory,
  searchLandmarks,
  type Landmark,
  type LandmarkCategory,
} from '@/data/landmarks';

export {
  faqItems,
  type FAQItem,
} from '@/data/faq';
