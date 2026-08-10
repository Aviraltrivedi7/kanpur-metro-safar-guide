import { Suspense } from 'react';
import type { Metadata } from 'next';

import { LiveBoardClient } from '@/components/arrivals/LiveBoardClient';
import { getStationById } from '@/data/stations';
import { HEADWAY_TAGLINE } from '@/data/timings';
import { buildMetadata } from '@/lib/metadata';

interface LivePageProps {
  searchParams: { station?: string; direction?: string };
}

export function generateMetadata({ searchParams }: LivePageProps): Metadata {
  const station = searchParams.station ? getStationById(searchParams.station) : undefined;
  const title = station ? `Live Arrivals — ${station.name}` : 'Live Arrivals Board';
  return buildMetadata({
    title,
    description: station
      ? `Next metro departures at ${station.name} — estimated from the published schedule (${HEADWAY_TAGLINE}). Real-time arrivals unavailable.`
      : `Next metro departures at every operational station — estimated from the published schedule (${HEADWAY_TAGLINE}). Real-time arrivals unavailable.`,
    path: station ? `/live?station=${station.id}` : '/live',
  });
}

function BoardFallback() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="card animate-pulse space-y-3 p-4">
          <div className="h-5 w-40 rounded-md bg-surface" />
          <div className="h-11 rounded-md bg-surface" />
          <div className="h-11 rounded-md bg-surface" />
          <div className="h-11 rounded-md bg-surface" />
        </div>
      ))}
    </div>
  );
}

export default function LivePage() {
  return (
    <div className="container-page py-10 pb-20 md:pb-0">
      <h1 className="section-heading">Live Arrivals Board</h1>
      <p className="section-subheading">
        Agli metro kab aa rahi hai har operational station par — schedule se estimated times.
        Board ka link share karne ke liye URL copy karein (station + direction shaamil hota hai).
      </p>

      <div className="mt-8">
        <Suspense fallback={<BoardFallback />}>
          <LiveBoardClient />
        </Suspense>
      </div>
    </div>
  );
}
