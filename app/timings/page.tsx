import { Clock3 } from 'lucide-react';
import { lineTimings } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Timings',
  description: 'Kanpur Metro operating hours — first and last train timings on Corridor 1.',
  path: '/timings',
});

export default function TimingsPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Metro Timings — Pehli aur Aakhri Train</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5">
          <Clock3 className="h-6 w-6 text-metro-blue" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">First Train</h2>
          <p className="mt-1 text-3xl font-bold">{lineTimings.firstTrain}</p>
        </div>
        <div className="card p-5">
          <Clock3 className="h-6 w-6 text-metro-blue" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">Last Train</h2>
          <p className="mt-1 text-3xl font-bold">{lineTimings.lastTrain}</p>
        </div>
        <div className="card p-5">
          <Clock3 className="h-6 w-6 text-muted" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">Frequency</h2>
          <p className="mt-1 text-lg font-bold">Not officially published</p>
        </div>
      </div>

      <div className="card mt-6 max-w-3xl p-5">
        <h2 className="text-base font-semibold">Good to know</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{lineTimings.note}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Services operate daily on Corridor 1 between IIT Kanpur and Kanpur Central. Arrive a few
          minutes early — gates close shortly before departure.
        </p>
      </div>
    </div>
  );
}
