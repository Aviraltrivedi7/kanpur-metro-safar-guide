import { Route as RouteIcon } from 'lucide-react';
import { corridors } from '@/services/metro';
import { CorridorSection } from '@/components/routes/CorridorSection';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Routes',
  description: 'Kanpur Metro routes — Corridor 1 station order from IIT Kanpur to Kanpur Central and the under-construction extension.',
  path: '/routes',
});

export default function RoutesPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading flex items-center gap-3">
        <RouteIcon className="h-8 w-8 text-metro-blue" aria-hidden="true" />
        Routes
      </h1>
      <p className="section-subheading">
        Kanpur Metro currently operates one corridor. All journeys are on Corridor 1.
      </p>
      {corridors.map((corridor) => (
        <CorridorSection key={corridor.id} corridor={corridor} />
      ))}
    </div>
  );
}
