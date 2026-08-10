import Link from 'next/link';
import { GraduationCap, HeartPulse, Landmark as LandmarkIcon, ShoppingBag, Train, Trees } from 'lucide-react';
import { getLandmarksByCategory, getStationById, landmarks, type LandmarkCategory } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Explore Kanpur',
  description: 'Places to visit near Kanpur Metro stations — tourist spots, hospitals, markets and railway connections.',
  path: '/explore',
});

const CATEGORIES: Array<{ id: LandmarkCategory; label: string; icon: typeof LandmarkIcon; blurb: string }> = [
  { id: 'tourist', label: 'Tourist Spots', icon: LandmarkIcon, blurb: 'Heritage and sightseeing' },
  { id: 'park', label: 'Parks & Lakes', icon: Trees, blurb: 'Green spaces and gardens' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, blurb: 'Malls and markets' },
  { id: 'education', label: 'Education', icon: GraduationCap, blurb: 'Universities and institutes' },
  { id: 'hospital', label: 'Hospitals', icon: HeartPulse, blurb: 'Major medical centres' },
  { id: 'railway', label: 'Connections', icon: Train, blurb: 'Railway stations & bus terminals' },
];

export default function ExplorePage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Kanpur Ghumo — Metro Ke Saath</h1>
      <p className="section-subheading">
        Reach Kanpur&apos;s key places using the metro. Pick a category or browse all places below.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map(({ id, label, icon: Icon, blurb }) => {
          const places = getLandmarksByCategory(id);
          return (
            <li key={id}>
              <a href={`#cat-${id}`} className="card flex h-full flex-col gap-1.5 p-4 transition-shadow duration-150 hover:shadow-elevated">
                <Icon className="h-6 w-6 text-metro-blue" aria-hidden="true" />
                <span className="font-semibold">{label}</span>
                <span className="text-xs text-muted">
                  {blurb} &middot; {places.length} place{places.length === 1 ? '' : 's'}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {CATEGORIES.map(({ id, label }) => {
        const places = getLandmarksByCategory(id);
        if (places.length === 0) return null;
        return (
          <section key={id} id={`cat-${id}`} className="mt-12 scroll-mt-24" aria-labelledby={`h-${id}`}>
            <h2 id={`h-${id}`} className="text-xl font-bold">{label}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((l) => {
                const station = getStationById(l.nearestStationId);
                return (
                  <li key={l.id}>
                    <Link href={`/explore/${l.id}`} className="card flex h-full flex-col gap-1.5 p-4 transition-shadow duration-150 hover:shadow-elevated">
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-xs text-muted">
                        Nearest: {station?.name ?? 'TBA'}
                        {l.walkingDistance ? ` · ${l.walkingDistance}` : ''}
                      </span>
                      <span className="line-clamp-2 text-sm text-muted">{l.description}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {landmarks.length === 0 && (
        <p className="mt-8 text-muted">No places listed yet.</p>
      )}
    </div>
  );
}
