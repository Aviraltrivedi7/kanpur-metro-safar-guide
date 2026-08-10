import { Route as RouteIcon, MoveRight } from 'lucide-react';
import Link from 'next/link';
import { corridors, getStationById } from '@/services/metro';
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

      {corridors.map((corridor) => {
        const ordered = corridor.stationIds
          .map((id) => getStationById(id))
          .filter((s): s is NonNullable<typeof s> => Boolean(s));
        const first = ordered[0];
        const last = ordered[ordered.length - 1];
        return (
          <section key={corridor.id} className="card mt-6 p-5" aria-labelledby={`r-${corridor.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`r-${corridor.id}`} className="text-base font-semibold">
                {corridor.name}: {first.name} <MoveRight className="inline h-4 w-4 text-muted" aria-hidden="true" /> {last.name}
              </h2>
              <span className="badge bg-operational/15 text-operational">{ordered.length} operational stations</span>
            </div>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stations/${s.id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-surface"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-metro-blue/10 font-mono text-xs font-semibold text-metro-blue" aria-hidden="true">
                      {s.stationNumber}
                    </span>
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-auto hidden text-xs text-muted sm:inline">
                      {s.type === 'elevated' ? 'Elevated' : 'Underground'}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
