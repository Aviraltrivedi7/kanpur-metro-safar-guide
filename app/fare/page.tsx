import { FareCalculator } from '@/components/fare/FareCalculator';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Fare Calculator',
  description: 'Estimate your Kanpur Metro ticket fare using publicly reported UPMRC fare slabs.',
  path: '/fare',
});

export default function FarePage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Metro Ka Kiraya</h1>
      <p className="section-subheading">
        Fares are based on the number of stops travelled, per publicly reported UPMRC slabs.
        Always verify the price at the station before you travel.
      </p>
      <div className="mt-6 max-w-2xl">
        <FareCalculator />
      </div>
    </div>
  );
}
