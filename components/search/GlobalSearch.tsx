'use client';

/**
 * components/search/GlobalSearch.tsx
 *
 * Global search over stations, landmarks and quick actions — local data only.
 * Feature 6:  / or Ctrl+K (⌘K on macOS) opens, Esc closes, arrows navigate,
 *             aria-activedescendant tracks the active option.
 * Feature 9:  stations also match on Hindi names + alternate names/keywords
 *             (e.g. "IIT", "CNB", "Z Square"); results grouped STATIONS /
 *             LANDMARKS / QUICK ACTIONS.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark as LandmarkIcon, MapPin, Route as RouteIcon, Search, X } from 'lucide-react';
import { landmarks, stations, type Landmark, type Station } from '@/services/metro';
import { cn } from '@/lib/utils';

type GroupKey = 'stations' | 'landmarks' | 'actions';

interface ResultItem {
  id: string;
  group: GroupKey;
  title: string;
  subtitle?: string;
  href: string;
}

const GROUP_LABELS: Record<GroupKey, string> = {
  stations: 'Stations',
  landmarks: 'Landmarks',
  actions: 'Quick Actions',
};

/** Extra informal names people actually search with. English aliases only —
 *  factual station names themselves are never translated or invented. */
const STATION_ALIASES: Record<string, string[]> = {
  'iit-kanpur': ['iit', 'iitk', 'iit kanpur'],
  'kanpur-central': ['cnb', 'central', 'railway station', 'kanpur station'],
  'llr-hospital': ['llr', 'hallett', 'lala lajpat rai', 'gsv', 'gsvm', 'medical college'],
  'spm-hospital': ['spm', 'hospital'],
  'bada-chauraha': ['z square', 'z-square', 'mall', 'bada chauraha'],
  vishwavidyalaya: ['university', 'csjm', 'csjmu'],
  'moti-jheel': ['moti jheel', 'lake'],
  kalyanpur: ['kalyanpur railway'],
  rawatpur: ['rawatpur railway'],
  'jhakarkati-bus-terminal': ['jhakarkati', 'isbt', 'bus stand'],
  'naveen-market': ['naveen', 'p road', 'padri bazar'],
  chunniganj: ['chunni ganj'],
  nayaganj: ['naya ganj'],
  'gurudev-chauraha': ['gurudev'],
  'geeta-nagar': ['kakadeo', 'kakadev'],
};

const QUICK_ACTIONS: ResultItem[] = [
  { id: 'action-journey', group: 'actions', title: 'Plan a Journey', subtitle: 'Stops, fare and time estimate', href: '/journey' },
  { id: 'action-live', group: 'actions', title: 'Live Arrivals', subtitle: 'Next metro at any station', href: '/live' },
  { id: 'action-fare', group: 'actions', title: 'Fare Calculator', subtitle: 'Estimate ticket price', href: '/fare' },
  { id: 'action-map', group: 'actions', title: 'Metro Map', subtitle: 'Interactive line map', href: '/metro-map' },
  { id: 'action-timings', group: 'actions', title: 'Timings', subtitle: 'First and last train', href: '/timings' },
  { id: 'action-routes', group: 'actions', title: 'Routes', subtitle: 'Corridor 1 station order', href: '/routes' },
  { id: 'action-near-me', group: 'actions', title: 'Station Near Me', subtitle: 'Find nearest metro station', href: '/#near-me-heading' },
];

function stationMatches(s: Station, q: string, rawQuery: string): boolean {
  if (s.name.toLowerCase().includes(q)) return true;
  if (s.nameHindi.includes(rawQuery)) return true;
  const aliases = STATION_ALIASES[s.id] ?? [];
  return aliases.some((a) => a.includes(q) || q.includes(a));
}

function stationToResult(s: Station): ResultItem {
  return {
    id: `station-${s.id}`,
    group: 'stations',
    title: s.name,
    subtitle: `${s.nameHindi} · Station #${s.stationNumber}${s.status === 'under-construction' ? ' · Upcoming' : ''}`,
    href: `/stations/${s.id}`,
  };
}

function landmarkToResult(l: Landmark): ResultItem {
  return {
    id: `landmark-${l.id}`,
    group: 'landmarks',
    title: l.name,
    subtitle: l.nameHindi,
    href: `/explore/${l.id}`,
  };
}

function GroupIcon({ item }: { item: ResultItem }) {
  if (item.group === 'stations') return <MapPin className="h-4 w-4 shrink-0 text-metro-blue" aria-hidden="true" />;
  if (item.group === 'landmarks') return <LandmarkIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />;
  return <RouteIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />;
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // OS-aware shortcut hint (⌘K on Apple platforms, Ctrl K elsewhere).
  useEffect(() => {
    const plat = window.navigator.userAgent.toLowerCase();
    setIsMac(plat.includes('mac') || plat.includes('iphone') || plat.includes('ipad'));
  }, []);

  // Open with keyboard shortcut: Ctrl+K, ⌘K, or '/'.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !open && !typing)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Scroll lock while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Empty state: quick actions + first five stations.
      return [...QUICK_ACTIONS.slice(0, 5), ...stations.slice(0, 5).map(stationToResult)];
    }
    const stationHits = stations.filter((s) => stationMatches(s, q, query.trim())).map(stationToResult);
    const landmarkHits = landmarks
      .filter((l) => l.name.toLowerCase().includes(q) || l.nameHindi.includes(query.trim()))
      .map(landmarkToResult);
    const actionHits = QUICK_ACTIONS.filter(
      (r) => r.title.toLowerCase().includes(q) || (r.subtitle ?? '').toLowerCase().includes(q)
    );
    return [...stationHits, ...landmarkHits, ...actionHits].slice(0, 12);
  }, [query]);

  useEffect(() => setActiveIndex(0), [query]);

  function navigate(item: ResultItem) {
    setOpen(false);
    router.push(item.href);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) navigate(item);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Grouped render: walk results and emit a heading whenever the group changes.
  const rendered: Array<{ type: 'heading'; label: string } | { type: 'item'; item: ResultItem; index: number }> = [];
  let lastGroup: GroupKey | null = null;
  results.forEach((item, index) => {
    if (item.group !== lastGroup) {
      rendered.push({ type: 'heading', label: GROUP_LABELS[item.group] });
      lastGroup = item.group;
    }
    rendered.push({ type: 'item', item, index });
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-secondary h-11 w-11 p-0"
        aria-label="Search (Ctrl K)"
        title={`Search (${isMac ? '⌘K' : 'Ctrl+K'})`}
        aria-haspopup="dialog"
        aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-navy/60 p-0 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="card mt-0 flex max-h-[100dvh] w-full max-w-xl flex-col overflow-hidden shadow-elevated sm:mt-[10vh] sm:max-h-[70vh] sm:rounded-lg">
            <div className="flex items-center gap-2 border-b border-app px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-expanded="true"
                aria-controls="global-search-list"
                aria-activedescendant={`gs-${results[activeIndex]?.id ?? ''}`}
                aria-label="Search stations, places and pages"
                placeholder="Kuch bhi dhundo — station, jagah, page…"
                className="w-full bg-transparent py-3.5 text-base leading-normal outline-none placeholder:text-muted sm:text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                enterKeyHint="go"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-secondary h-11 w-11 shrink-0 p-0 sm:hidden"
                aria-label="Close search"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <kbd className="hidden rounded border border-app px-1.5 py-0.5 text-[10px] text-muted sm:inline" aria-hidden="true">Esc</kbd>
            </div>
            <ul
              ref={listRef}
              id="global-search-list"
              role="listbox"
              aria-label="Search results"
              className="flex-1 overflow-auto overscroll-contain p-1.5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  Kuch nahi mila &ldquo;{query}&rdquo; ke liye. Try a station name like
                  &ldquo;IIT&rdquo; or &ldquo;Central&rdquo;.
                </li>
              )}
              {rendered.map((row) =>
                row.type === 'heading' ? (
                  <li
                    key={`h-${row.label}`}
                    aria-hidden="true"
                    className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted"
                  >
                    {row.label}
                  </li>
                ) : (
                  <li
                    key={row.item.id}
                    id={`gs-${row.item.id}`}
                    role="option"
                    aria-selected={row.index === activeIndex}
                    data-index={row.index}
                  >
                    <button
                      type="button"
                      className={cn(
                        'flex w-full min-h-[44px] items-center gap-3 rounded-md px-3 py-2.5 text-left',
                        row.index === activeIndex ? 'bg-metro-blue/10' : 'hover:bg-surface'
                      )}
                      onMouseEnter={() => setActiveIndex(row.index)}
                      onClick={() => navigate(row.item)}
                    >
                      <GroupIcon item={row.item} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{row.item.title}</span>
                        {row.item.subtitle && (
                          <span className="block truncate text-xs text-muted">{row.item.subtitle}</span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
