import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, MapPin, TrainFront } from 'lucide-react';
import { getLandmarkById, getStationById, landmarks } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/lib/site';

export function generateStaticParams() {
  return landmarks.map((l) => ({ 'landmark-id': l.id }));
}

export function generateMetadata({ params }: { params: { 'landmark-id': string } }): Metadata {
  const landmark = getLandmarkById(params['landmark-id']);
  if (!landmark) return buildMetadata({ title: 'Place not found', path: `/explore/${params['landmark-id']}` });
  const station = getStationById(landmark.nearestStationId);
  return buildMetadata({
    title: `How to reach ${landmark.name} by Kanpur Metro`,
    description: `Reach ${landmark.name} via Kanpur Metro — nearest station: ${station?.name ?? 'TBA'}. ${landmark.description}`,
    path: `/explore/${landmark.id}`,
  });
}

export default function LandmarkDetailPage({ params }: { params: { 'landmark-id': string } }) {
  const landmark = getLandmarkById(params['landmark-id']);
  if (!landmark) notFound();
  const station = getStationById(landmark.nearestStationId);

  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-metro-blue hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Explore
      </Link>

      <div className="mt-4 max-w-3xl">
        <h1 className="section-heading">How to reach {landmark.name} by Kanpur Metro</h1>
        <p className="mt-2 text-lg text-muted">{landmark.nameHindi}</p>
        <p className="mt-4 leading-relaxed text-muted">{landmark.description}</p>

        <div className="card mt-6 p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <TrainFront className="h-5 w-5 text-metro-blue" aria-hidden="true" />
            Nearest Metro Station
          </h2>
          {station ? (
            <div className="mt-3">
              <Link href={`/stations/${station.id}`} className="text-lg font-semibold text-metro-blue hover:underline">
                {station.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {station.nameHindi} &middot; Station #{station.stationNumber}
                {landmark.walkingDistance ? ` · ${landmark.walkingDistance}` : ''}
              </p>
              {station.status === 'under-construction' && (
                <p className="mt-2 rounded-md bg-upcoming/10 p-3 text-sm text-upcoming">
                  Note: this metro station is under construction and not yet open.
                </p>
              )}
              {station.status === 'operational' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/journey?to=${station.id}`} className="btn btn-primary h-10 px-4 text-sm">
                    Plan journey to {station.name}
                  </Link>
                  <Link href={`/stations/${station.id}`} className="btn btn-secondary h-10 px-4 text-sm">
                    Station details
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Nearest station information is not available yet.
            </p>
          )}
        </div>

        {!landmark.verified && (
          <p className="mt-6 text-xs text-muted">
            Some local details on this page are approximate and not officially confirmed.
          </p>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: landmark.name,
            description: landmark.description,
            url: absoluteUrl(`/explore/${landmark.id}`),
          }),
        }}
      />
    </div>
  );
}
