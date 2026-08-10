import { MetroMap } from '@/components/map/MetroMap';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Metro Map',
  description: 'Interactive Kanpur Metro map — operational stations and the under-construction extension toward Naubasta.',
  path: '/metro-map',
});

export default function MetroMapPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Kanpur Metro Map</h1>
      <p className="section-subheading">
        Corridor 1 — IIT Kanpur ↔ Kanpur Central (operational), with the under-construction
        extension toward Naubasta. Click a station for details.
      </p>
      <div className="mt-6">
        <MetroMap />
      </div>
    </div>
  );
}
