'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, Search, TrainFront } from 'lucide-react';
import { stations, type StationStatus, type StationType } from '@/services/metro';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | StationStatus;
type TypeFilter = 'all' | StationType;

export function StationDirectory() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [descending, setDescending] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = stations.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.nameHindi.includes(query.trim())) return false;
      return true;
    });
    return [...filtered].sort((a, b) =>
      descending ? b.stationNumber - a.stationNumber : a.stationNumber - b.stationNumber
    );
  }, [query, statusFilter, typeFilter, descending]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="card space-y-3 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search stations"
            placeholder="Search by name (English or हिंदी)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
            {(
              [
                ['all', 'All'],
                ['operational', 'Operational'],
                ['under-construction', 'Upcoming'],
              ] as Array<[StatusFilter, string]>
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={statusFilter === value}
                onClick={() => setStatusFilter(value)}
                className={cn(
                  'badge min-h-[44px] cursor-pointer px-3 transition-colors duration-150',
                  statusFilter === value ? 'bg-metro-blue text-white' : 'bg-surface text-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
            {(
              [
                ['all', 'Any type'],
                ['elevated', 'Elevated'],
                ['underground', 'Underground'],
              ] as Array<[TypeFilter, string]>
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={typeFilter === value}
                onClick={() => setTypeFilter(value)}
                className={cn(
                  'badge min-h-[44px] cursor-pointer px-3 transition-colors duration-150',
                  typeFilter === value ? 'bg-navy text-white dark:bg-metro-light' : 'bg-surface text-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDescending((v) => !v)}
            className="btn btn-secondary ml-auto h-11 px-3 text-sm"
            aria-label={descending ? 'Sort ascending by station number' : 'Sort descending by station number'}
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            #{descending ? '21 → 1' : '1 → 21'}
          </button>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-muted" aria-live="polite">
        {results.length} station{results.length === 1 ? '' : 's'} found
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {results.map((s) => (
          <li key={s.id}>
            <Link href={`/stations/${s.id}`} className="card flex h-full items-start gap-3 p-4 transition-shadow duration-150 hover:shadow-elevated">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold',
                  s.status === 'operational' ? 'bg-metro-blue text-white' : 'bg-surface text-muted'
                )}
                aria-hidden="true"
              >
                <TrainFront className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{s.name}</span>
                  <span className={cn('badge', s.status === 'operational' ? 'bg-operational/15 text-operational' : 'bg-upcoming/15 text-upcoming')}>
                    {s.status === 'operational' ? 'Operational' : 'Upcoming'}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {s.nameHindi} &middot; Station #{s.stationNumber} &middot;{' '}
                  {s.type === 'elevated' ? 'Elevated' : 'Underground'}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-medium">No stations match your search.</p>
          <p className="mt-1 text-sm text-muted">Try a different spelling or clear the filters.</p>
        </div>
      )}
    </div>
  );
}
