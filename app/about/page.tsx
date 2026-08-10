import { buildMetadata } from '@/lib/metadata';
import { UPMRC_DISCLAIMER } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'About',
  description: 'About the Kanpur Metro Safar Guide — an independent travel guide for Kanpur Metro passengers.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Is Guide Ke Baare Mein</h1>
      <div className="prose mt-6 max-w-3xl space-y-4 leading-relaxed text-muted">
        <p>
          Kanpur Metro Safar Guide is an independent travel companion for passengers of the Kanpur
          Metro. It brings together station information, fare estimates, route maps and places to
          visit near the metro in one place.
        </p>
        <p>
          The guide is designed to be fast, accessible, and accurate. Data that is not confirmed by
          official sources is clearly marked, and no live status is shown when no official feed
          exists.
        </p>
        <p className="rounded-md border-l-4 border-accent bg-card p-4">
          {UPMRC_DISCLAIMER} For official announcements, fares and notices, refer to UPMRC — the
          operator of the Kanpur Metro.
        </p>
        <p>
          Feedback and corrections are welcome — the goal is to keep this the most reliable
          unofficial companion for Kanpur Metro travel.
        </p>
      </div>
    </div>
  );
}
