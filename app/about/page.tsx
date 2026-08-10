import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Clock,
  Compass,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  MoveRight,
  Ticket,
  TrainFront,
  Info,
} from 'lucide-react';

const GITHUB_ISSUES_URL =
  'https://github.com/Aviraltrivedi7/kanpur-metro-safar-guide/issues';

interface Feature {
  icon: typeof TrainFront;
  title: string;
  desc: string;
}

// Only features that actually exist on the live site.
const features: Feature[] = [
  { icon: TrainFront, title: 'Journey Planning', desc: 'Plan a route between any two Metro stations.' },
  { icon: MapIcon, title: 'Metro Map', desc: 'Explore the Kanpur Metro network and all stations.' },
  { icon: MapPin, title: 'Station Information', desc: 'Find details about individual stations near you.' },
  { icon: Ticket, title: 'Fare Information', desc: 'Check fare information for your planned journey.' },
  { icon: Clock, title: 'Metro Timings', desc: 'First and last Metro timing information.' },
  { icon: Compass, title: 'Explore Kanpur', desc: 'Discover places connected to the Metro network.' },
];

export const metadata: Metadata = {
  title: 'About | Kanpur Metro Safar Guide by Aviral Trivedi',
  description:
    'Kanpur Metro Safar Guide is an independent project by Aviral Trivedi, built to make Kanpur Metro travel information simple and easy to find.',
  openGraph: {
    title: 'About — Kanpur Metro Safar Guide',
    description:
      'An independent project by Aviral Trivedi to make Kanpur Metro travel easier.',
    url: 'https://kanpur-metro-safar-guide.vercel.app/about',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kanpur-metro-safar-guide.vercel.app/about',
  },
};

/**
 * Subtle metro-line SVG decoration — a horizontal line with station dots.
 * Line draws left→right, dots fade in, all via CSS so it respects
 * prefers-reduced-motion (animation disabled there).
 */
function MetroLineDeco() {
  return (
    <svg
      viewBox="0 0 400 24"
      aria-hidden="true"
      className="mx-auto mt-4 h-6 w-full max-w-md text-metro-blue"
      fill="none"
    >
      <line
        x1="0"
        y1="12"
        x2="400"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        pathLength={1}
        className="about-metro-line"
      />
      <circle cx="40"  cy="12" r="5" fill="currentColor" className="about-metro-dot about-metro-dot-1" />
      <circle cx="155" cy="12" r="5" fill="currentColor" className="about-metro-dot about-metro-dot-2" />
      <circle cx="265" cy="12" r="5" fill="currentColor" className="about-metro-dot about-metro-dot-3" />
      <circle cx="370" cy="12" r="5" fill="currentColor" className="about-metro-dot about-metro-dot-4" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      {/* 1 — HERO */}
      <section className="relative mx-auto max-w-2xl text-center" aria-label="About the project">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          ABOUT THE PROJECT
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Built for Kanpur.
          <br />
          Made to make Metro travel easier.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Kanpur Metro Safar Guide is an independent project created to bring Metro travel
          information together in one simple, easy-to-use place.
        </p>
        <MetroLineDeco />
        <div className="mt-6">
          <Link href="/" className="btn btn-primary h-11 inline-flex items-center gap-2 px-5 text-sm">
            Explore Metro Guide
            <MoveRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 2 — CREATOR */}
      <section className="mx-auto mt-12 max-w-2xl" aria-labelledby="creator-heading">
        <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-metro-blue text-2xl font-bold text-white"
            aria-label="Aviral Trivedi"
          >
            AT
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Meet the Creator
            </p>
            <h2 id="creator-heading" className="mt-1 text-xl font-bold text-ink">
              Aviral Trivedi
            </h2>
            <p className="text-sm text-muted">Creator &amp; Developer — Kanpur Metro Safar Guide</p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                “I built Kanpur Metro Safar Guide with one simple goal — make it easier for anyone in
                Kanpur to find the information they need before and during their Metro journey.”
              </p>
              <p>
                “Finding a route, checking a fare, or figuring out which station to use shouldn&apos;t
                require searching across multiple places. I wanted to bring that information into one
                straightforward platform.”
              </p>
              <p>“That simple idea is what became this project.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — FEATURE GRID */}
      <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-center text-xl font-bold text-ink">
          What You&apos;ll Find Here
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card p-4">
                <Icon className="h-6 w-6 text-metro-blue" aria-hidden="true" />
                <p className="mt-2 font-semibold text-ink">{f.title}</p>
                <p className="mt-1 text-sm text-muted">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 — QUOTE */}
      <section className="mx-auto mt-12 max-w-2xl rounded-lg bg-surface p-6 sm:p-8" aria-label="Quote">
        <blockquote className="border-l-4 border-metro-blue pl-4">
          <p className="text-lg font-medium leading-relaxed text-muted">
                “I built this project with one thought: finding your Metro route should be simpler than
                finding the information about it.”
          </p>
        </blockquote>
        <p className="mt-4 text-center text-sm text-muted">
          — Aviral Trivedi
          <span className="block text-xs">Creator, Kanpur Metro Safar Guide</span>
        </p>
      </section>

      {/* 5 — DISCLAIMER (essential) */}
      <section className="mx-auto mt-12 max-w-2xl" aria-labelledby="disclaimer-heading">
        <div className="card flex gap-4 border-accent/40 p-5 sm:p-6">
          <Info className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <h2 id="disclaimer-heading" className="text-lg font-bold text-ink">
              An Independent Project
            </h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
              <p>
                Kanpur Metro Safar Guide is an independently created travel information platform by
                Aviral Trivedi.
              </p>
              <p>
                It is not affiliated with, endorsed by, or operated by UPMRC (Uttar Pradesh Metro
                Rail Corporation).
              </p>
              <p>
                Metro information shown on this platform may change. For official announcements,
                fares, and service updates, please verify through UPMRC&apos;s official channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — FEEDBACK */}
      <section className="mx-auto mt-12 max-w-2xl text-center" aria-labelledby="feedback-heading">
        <h2 id="feedback-heading" className="text-lg font-bold text-ink">
          Found something incorrect?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Metro information changes. If you find something outdated or incorrect, let me know — I&apos;ll
          get it fixed.
        </p>
        <div className="mt-5">
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary h-11 w-full inline-flex items-center justify-center gap-2 px-5 text-sm sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Report an Issue
            <MoveRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-metro-blue hover:underline"
        >
          Have a suggestion? Share it →
        </a>
      </section>
    </div>
  );
}
