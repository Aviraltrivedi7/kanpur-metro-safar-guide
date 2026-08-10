import Link from 'next/link';
import { Calculator, ListOrdered, Map, MoveRight, TrainFront } from 'lucide-react';
import { JourneyPlanner } from '@/components/journey/JourneyPlanner';
import { SavedJourneys } from '@/components/journey/SavedJourneys';
import { RecentJourneys } from '@/components/journey/RecentJourneys';
import { TodayWidget } from '@/components/home/TodayWidget';
import { NearMe } from '@/components/nearby/NearMe';
import { StatusBanner } from '@/components/status/StatusBanner';
import { NextMetroWidget } from '@/components/arrivals/NextMetroWidget';
import { ServiceAlerts } from '@/components/alerts/ServiceAlerts';
import { FAQSection } from '@/components/faq/FAQSection';
import { OPERATIONAL_STATION_COUNT, getStationById, landmarks } from '@/services/metro';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ path: '/' });

/** "Important" stations: terminals + railway interchanges. */
const IMPORTANT_STATION_IDS = ['iit-kanpur', 'moti-jheel', 'naveen-market', 'kanpur-central'];

/**
 * Quick Routes are derived from real operational stations — never hardcoded pairs.
 * Terminal-to-key-station direction pairs, derived from the live corridor.
 */
const QUICK_ROUTE_IDS: Array<[string, string]> = [
  ['iit-kanpur', 'kanpur-central'],
  ['kanpur-central', 'iit-kanpur'],
  ['naveen-market', 'kanpur-central'],
];

export default function HomePage() {
  const quickRoutes = QUICK_ROUTE_IDS.map(([from, to]) => {
    const fromStation = getStationById(from);
    const toStation = getStationById(to);
    if (!fromStation || !toStation) throw new Error(`Unknown quick-route station: ${from}/${to}`);
    return { from: fromStation, to: toStation };
  });

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="border-b border-app bg-gradient-to-b from-metro-blue/5 to-transparent">
        <div className="container-page flex flex-col items-center gap-6 py-10 text-center sm:gap-8 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-xl font-bold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
              Kanpur Metro Safar, <span className="text-metro-blue">Ab Aur Easy.</span>
            </h1>
            <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-lg">
              {OPERATIONAL_STATION_COUNT} Operational Stations &middot; IIT Kanpur &harr; Kanpur Central
            </p>
          </div>
          <JourneyPlanner />
        </div>
      </section>

      <div className="container-page space-y-10 py-8 sm:space-y-14 sm:py-12">
        {/* Service alerts (Phase 12) — shown only when alerts are active */}
        <ServiceAlerts />

        {/* Next Metro — hero arrival estimator (Phase 12) */}
        <NextMetroWidget />

        {/* TodayWidget — "Kanpur Metro — Aaj" at a glance */}
        <TodayWidget />

        {/* Feature 4 — personalized recent journeys (hidden on first visit) */}
        <RecentJourneys />

        {/* Feature 3 — saved journeys (hidden until user saves one) */}
        <SavedJourneys />

        {/* Feature 1 — nearest station finder (consent-first GPS) */}
        <section aria-labelledby="near-me-heading">
          <h2 id="near-me-heading" className="sr-only">
            Find nearest station
          </h2>
          <NearMe />
        </section>

        {/* Status */}
        <section aria-labelledby="status-heading">
          <h2 id="status-heading" className="section-heading">Metro Status</h2>
          <div className="mt-4">
            <StatusBanner />
          </div>
        </section>

        {/* Quick Actions */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="section-heading">What do you need?</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: '/fare', icon: Calculator, label: 'Fare Calculator', desc: 'Estimate your ticket price' },
              { href: '/live', icon: TrainFront, label: 'Live Arrivals', desc: 'Next metro at any station' },
              { href: '/stations', icon: ListOrdered, label: 'All Stations', desc: `${OPERATIONAL_STATION_COUNT} operational` },
              { href: '/metro-map', icon: Map, label: 'Metro Map', desc: 'Interactive route map' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <li key={href}>
                <Link href={href} className="card group flex h-full flex-col gap-2 p-4 transition-shadow duration-150 hover:shadow-elevated">
                  <Icon className="h-6 w-6 text-metro-blue" aria-hidden="true" />
                  <span className="font-semibold">{label}</span>
                  <span className="text-xs text-muted">{desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Routes — spec: label is "Quick Routes", NOT "Popular Routes" */}
        <section aria-labelledby="quick-routes-heading">
          <h2 id="quick-routes-heading" className="section-heading">Quick Routes</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {quickRoutes.map(({ from, to }) => (
              <li key={`${from.id}-${to.id}`}>
                <Link
                  href={`/journey?from=${from.id}&to=${to.id}`}
                  className="card group flex items-center justify-between gap-3 p-4 transition-shadow duration-150 hover:shadow-elevated"
                >
                  <span className="min-w-0 text-sm font-medium">
                    <span className="block break-words">{from.name}</span>
                    <MoveRight className="my-1 h-4 w-4 text-muted" aria-hidden="true" />
                    <span className="block break-words">{to.name}</span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-metro-blue group-hover:underline">Plan</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Important stations */}
        <section aria-labelledby="important-stations-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="important-stations-heading" className="section-heading">Important Stations</h2>
            <Link href="/stations" className="text-sm font-medium text-metro-blue hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {IMPORTANT_STATION_IDS.map((id) => {
              const s = getStationById(id)!;
              return (
                <li key={s.id}>
                  <Link href={`/stations/${s.id}`} className="card flex h-full flex-col gap-1 p-4 transition-shadow duration-150 hover:shadow-elevated">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <TrainFront className="h-4 w-4 text-metro-blue" aria-hidden="true" />
                      {s.name}
                    </span>
                    <span className="text-xs text-muted">{s.nameHindi}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Explore preview */}
        <section aria-labelledby="explore-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="explore-heading" className="section-heading">Explore Kanpur</h2>
            <Link href="/explore" className="text-sm font-medium text-metro-blue hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {landmarks.slice(0, 3).map((l) => {
              const station = getStationById(l.nearestStationId);
              return (
                <li key={l.id}>
                  <Link href={`/explore/${l.id}`} className="card flex h-full flex-col gap-1.5 p-4 transition-shadow duration-150 hover:shadow-elevated">
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-xs text-muted">
                      {station ? `Nearest: ${station.name}` : 'Nearest station TBD'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* FAQ preview */}
        <section aria-labelledby="faq-heading" className="max-w-3xl">
          <h2 id="faq-heading" className="section-heading">Frequently Asked Questions</h2>
          <div className="mt-4">
            <FAQSection limit={5} />
          </div>
        </section>
      </div>
    </div>
  );
}
