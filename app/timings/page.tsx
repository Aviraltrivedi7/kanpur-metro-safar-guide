import { BadgeCheck, Clock3, Gauge, Info } from 'lucide-react';
import { ARRIVAL_TIMES_DISCLAIMER, HEADWAY_TAGLINE, lineTimings, metroConfig } from '@/data/timings';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Timings',
  description: `Kanpur Metro operating hours — first and last train timings and the published ${HEADWAY_TAGLINE} frequency on Corridor 1.`,
  path: '/timings',
});

export default function TimingsPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Metro Timings — Pehli aur Aakhri Train</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card km-card-lift p-5">
          <Clock3 className="h-6 w-6 text-metro-blue" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">First Train</h2>
          <p className="mt-1 text-3xl font-bold tabular-nums">{lineTimings.firstTrain}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-operational">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified — publicly reported
          </p>
        </div>
        <div className="card km-card-lift p-5">
          <Clock3 className="h-6 w-6 text-metro-blue" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">Last Train</h2>
          <p className="mt-1 text-3xl font-bold tabular-nums">{lineTimings.lastTrain}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-operational">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified — publicly reported
          </p>
        </div>
        <div className="card km-card-lift p-5">
          <Gauge className="h-6 w-6 text-metro-blue" aria-hidden="true" />
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">Frequency</h2>
          <p className="mt-1 text-2xl font-bold">
            Every {metroConfig.peakHeadwayMinutes}–{metroConfig.offPeakHeadwayMinutes} min
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-operational">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Published — exact per-hour table nahi
          </p>
        </div>
      </div>

      <div className="card mt-6 max-w-3xl p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Info className="h-4 w-4 text-metro-blue" aria-hidden="true" /> Good to know
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{lineTimings.note}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Services operate daily on Corridor 1 between IIT Kanpur and Kanpur Central. Arrive a few
          minutes early — gates close shortly before departure.
        </p>
        <p className="mt-3 border-t border-appBorder pt-3 text-xs text-muted">
          {ARRIVAL_TIMES_DISCLAIMER}
          <br />
          Last verified: {metroConfig.lastVerified} · This site is not affiliated with UPMRC.
        </p>
      </div>
    </div>
  );
}
