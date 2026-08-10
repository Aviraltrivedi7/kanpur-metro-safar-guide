import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Accessibility, ArrowLeft, ChevronsUpDown, Check, Droplets, DoorOpen, MoveVertical, ShieldCheck, Ticket, Users, X } from 'lucide-react';
import { getStationById, landmarks, stations, lineTimings } from '@/services/metro';
import { NextMetroWidget } from '@/components/arrivals/NextMetroWidget';
import { buildMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/lib/site';

const FACILITY_LABELS: Array<{ key: keyof import('@/services/metro').StationFacilities; label: string; icon: typeof Ticket }> = [
  { key: 'ticketCounter', label: 'Ticket Counter', icon: Ticket },
  { key: 'parking', label: 'Parking', icon: DoorOpen },
  { key: 'lift', label: 'Lift', icon: ChevronsUpDown },
  { key: 'escalator', label: 'Escalator', icon: MoveVertical },
  { key: 'restroom', label: 'Restroom', icon: Users },
  { key: 'drinkingWater', label: 'Drinking Water', icon: Droplets },
  { key: 'waitingArea', label: 'Waiting Area', icon: Accessibility },
  { key: 'securityCheck', label: 'Security Check', icon: ShieldCheck },
];

export function generateStaticParams() {
  return stations.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const station = getStationById(params.id);
  if (!station) return buildMetadata({ title: 'Station not found', path: `/stations/${params.id}` });

  const base = buildMetadata({
    title: `${station.name} Metro Station`,
    description: `${station.name} (station #${station.stationNumber}) on Kanpur Metro Corridor 1 — ${station.status === 'operational' ? 'operational' : 'under construction'}, ${station.type}. Nearby landmarks, gates and facilities.`,
    path: `/stations/${station.id}`,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
    },
  };
}

export default function StationDetailPage({ params }: { params: { id: string } }) {
  const station = getStationById(params.id);
  if (!station) notFound();

  const nearby = landmarks.filter((l) => l.nearestStationId === station.id);

  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <Link href="/stations" className="inline-flex items-center gap-1.5 text-sm font-medium text-metro-blue hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All stations
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-heading">
            {station.name} <span className="mt-1 block text-lg font-medium text-muted">{station.nameHindi}</span>
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="badge bg-metro-blue/10 text-metro-blue">Station #{station.stationNumber}</span>
            <span className="badge bg-surface text-muted">{station.type === 'elevated' ? 'Elevated' : 'Underground'}</span>
            {station.status === 'operational' ? (
              <span className="badge bg-operational/15 text-operational">Operational</span>
            ) : (
              <span className="badge bg-upcoming/15 text-upcoming">Under construction</span>
            )}
          </p>
        </div>
        {station.status === 'operational' && (
          <Link href={`/journey?from=${station.id}`} className="btn btn-primary">
            Plan journey from here
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Next Metro — arrival estimator for this station (Phase 12) */}
          {station.status === 'operational' && <NextMetroWidget preSelectedStationId={station.id} />}

          {/* Facilities */}
          <section className="card p-5" aria-labelledby="facilities-heading">
            <h2 id="facilities-heading" className="text-base font-semibold">Facilities</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FACILITY_LABELS.map(({ key, label }) => {
                const has = station.facilities[key];
                return (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    {has ? (
                      <Check className="h-4 w-4 shrink-0 text-operational" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    )}
                    <span className={has ? '' : 'text-muted'}>{label}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Timings */}
          <section className="card p-5" aria-labelledby="timings-heading">
            <h2 id="timings-heading" className="text-base font-semibold">Timings</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {station.status === 'operational' ? (
                <>
                  Corridor 1 services run from <strong className="text-ink">{lineTimings.firstTrain}</strong> to{' '}
                  <strong className="text-ink">{lineTimings.lastTrain}</strong> daily. {lineTimings.note}
                </>
              ) : (
                'This station is under construction and not yet open to passengers.'
              )}
            </p>
          </section>

          {/* Exit gates */}
          {station.exitGates.length > 0 && (
            <section className="card p-5" aria-labelledby="gates-heading">
              <h2 id="gates-heading" className="text-base font-semibold">Exit Gates</h2>
              <ul className="mt-3 space-y-2">
                {station.exitGates.map((gate, i) => (
                  <li key={gate} className="flex items-start gap-2 text-sm">
                    <DoorOpen className="mt-0.5 h-4 w-4 shrink-0 text-metro-blue" aria-hidden="true" />
                    <span>
                      {gate}
                      {station.exitGatesHindi[i] && <span className="ml-2 text-xs text-muted">{station.exitGatesHindi[i]}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {(station.nearbyLandmarks.length > 0 || nearby.length > 0) && (
            <section className="card p-5" aria-labelledby="nearby-heading">
              <h2 id="nearby-heading" className="text-base font-semibold">Nearby</h2>
              {station.nearbyLandmarks.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {station.nearbyLandmarks.map((lm) => (
                    <li key={lm}>&middot; {lm}</li>
                  ))}
                </ul>
              )}
              {nearby.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-app pt-3 text-sm">
                  {nearby.map((l) => (
                    <li key={l.id}>
                      <Link href={`/explore/${l.id}`} className="font-medium text-metro-blue hover:underline">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {station.interchange && (
            <section className="card border-l-4 border-l-accent p-5" aria-label="Interchange information">
              <h2 className="text-base font-semibold">Interchange</h2>
              <p className="mt-2 text-sm text-muted">
                This station connects with other transport (railway / bus services).
              </p>
            </section>
          )}
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: `${station.name} Metro Station`,
            alternateName: station.nameHindi,
            url: absoluteUrl(`/stations/${station.id}`),
          }),
        }}
      />
    </div>
  );
}
