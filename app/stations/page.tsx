import { StationDirectory } from '@/components/stations/StationDirectory';
import { OPERATIONAL_STATION_COUNT } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Stations',
  description: `All Kanpur Metro stations — ${OPERATIONAL_STATION_COUNT} operational on Corridor 1 plus the under-construction extension.`,
  path: '/stations',
});

export default function StationsPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Sabhi Metro Stations</h1>
      <p className="section-subheading">
        {OPERATIONAL_STATION_COUNT} stations are operational between IIT Kanpur and Kanpur Central.
        7 more are under construction toward Naubasta.
      </p>
      <div className="mt-6">
        <StationDirectory />
      </div>
    </div>
  );
}
