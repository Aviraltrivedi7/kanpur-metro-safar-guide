import { Suspense } from 'react';
import { JourneyPlanner } from '@/components/journey/JourneyPlanner';
import { JourneyResult } from '@/components/journey/JourneyResult';
import { SharedJourneyTracker } from '@/components/journey/SharedJourneyTracker';
import { WhenToLeave } from '@/components/journey/WhenToLeave';
import { calculateJourney } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Plan a Journey',
  description:
    'Plan your Kanpur Metro journey — stops, fare estimate and station list. Ab dost bhi bhejo, ek tap mein.',
  path: '/journey',
});

function JourneyContent({ from, to }: { from?: string; to?: string }) {
  if (!from || !to) {
    return (
      <p className="text-sm text-muted">
        Upar se starting station aur destination choose karo — stops, fare aur time estimate turant
        dikhenge.
      </p>
    );
  }
  return (
    <>
      <SharedJourneyTracker />
      <JourneyResult fromId={from} toId={to} />
      <WhenToLeaveSection from={from} to={to} />
    </>
  );
}

/** "Kab nikalna chahiye?" — only when a computable journey exists. */
function WhenToLeaveSection({ from, to }: { from: string; to: string }) {
  const journey = calculateJourney(from, to);
  if (!journey || journey.estimatedTimeMinutes === null) return null;
  return <WhenToLeave journey={journey} />;
}

export default function JourneyPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Plan Karo Apni Journey</h1>
      <div className="mt-6 flex flex-col items-start gap-8">
        <JourneyPlanner />
        <Suspense fallback={null}>
          <JourneyContent from={searchParams.from} to={searchParams.to} />
        </Suspense>
      </div>
    </div>
  );
}
