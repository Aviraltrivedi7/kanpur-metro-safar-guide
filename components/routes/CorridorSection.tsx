'use client';

/**
 * components/routes/CorridorSection.tsx
 *
 * Interactive corridor visualisation: SVG line strip (elevated / underground /
 * under-construction segments) + full ordered station list with sort toggle.
 * Includes every corridor station — operational AND under construction —
 * consistent with the MetroMap page.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, MoveRight } from 'lucide-react';
import { stations, type Corridor, type Station } from '@/services/metro';
import { cn } from '@/lib/utils';

const X_STEP = 78;
const X_START = 60;
const Y = 150;

function xFor(stationNumber: number): number {
  return X_START + (stationNumber - 1) * X_STEP;
}

export function CorridorSection({ corridor }: { corridor: Corridor }) {
  const [descending, setDescending] = useState(false);

  // Every station on this corridor, operational and upcoming, in line order.
  const ordered = useMemo(
    () =>
      stations
        .filter((s): s is Station => s.corridor === corridor.id)
        .sort((a, b) => a.stationNumber - b.stationNumber),
    [corridor.id]
  );

  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  const operationalList = useMemo(() => ordered.filter((s) => s.status === 'operational'), [ordered]);
  const upcomingList = useMemo(() => ordered.filter((s) => s.status !== 'operational'), [ordered]);
  const lastOperational = operationalList[operationalList.length - 1];
  const displayList = descending ? [...ordered].reverse() : ordered;

  const totalWidth = xFor(last.stationNumber) + 80;

  return (
    <section className="mt-6" aria-labelledby={`r-${corridor.id}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`r-${corridor.id}`} className="text-base font-semibold">
          {corridor.name}: {first.name}{' '}
          <MoveRight className="inline h-4 w-4 text-muted" aria-hidden="true" /> {last.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-operational/15 text-operational">
            {operationalList.length} operational
          </span>
          {upcomingList.length > 0 && (
            <span className="badge bg-upcoming/15 text-upcoming">{upcomingList.length} upcoming</span>
          )}
        </div>
      </div>

      {/* Corridor strip — visual line with elevated/underground split */}
      <div
        className="card mt-4 overflow-x-auto no-scrollbar"
        tabIndex={0}
        role="application"
        aria-label={`${corridor.name} corridor visualisation`}
      >
        <svg
          viewBox={`0 0 ${totalWidth} 300`}
          width={totalWidth}
          height={300}
          className="mx-auto block"
          role="img"
          aria-label={`${corridor.name} — ${operationalList.length} operational stations from ${first.name} to ${lastOperational?.name ?? last.name}${upcomingList.length > 0 ? `, ${upcomingList.length} more under construction toward ${last.name}` : ''}`}
        >
          {/* Elevated segment (operational, stations 1–9) */}
          <line
            x1={xFor(1)}
            y1={Y}
            x2={xFor(9)}
            y2={Y}
            stroke="var(--color-metro-blue)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Underground segment (operational, stations 9–14) */}
          <line
            x1={xFor(9)}
            y1={Y}
            x2={xFor(lastOperational?.stationNumber ?? 9)}
            y2={Y}
            stroke="var(--color-navy)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Under-construction extension */}
          {lastOperational && last.stationNumber > lastOperational.stationNumber && (
            <line
              x1={xFor(lastOperational.stationNumber)}
              y1={Y}
              x2={xFor(last.stationNumber)}
              y2={Y}
              stroke="var(--color-upcoming)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 8"
            />
          )}

          {ordered.map((s) => {
            const x = xFor(s.stationNumber);
            const upcoming = s.status !== 'operational';
            return (
              <g key={s.id}>
                <circle
                  cx={x}
                  cy={Y}
                  r={8}
                  className={cn(
                    'transition-all duration-150',
                    upcoming ? 'fill-card stroke-upcoming' : 'fill-card stroke-metro-blue'
                  )}
                  strokeWidth={3}
                  strokeDasharray={upcoming ? '3 3' : undefined}
                />
                <text
                  x={x}
                  y={s.stationNumber % 2 === 0 ? Y + 38 : Y - 28}
                  textAnchor="middle"
                  className={cn('select-none', upcoming ? 'fill-upcoming' : 'fill-ink')}
                  fontSize="11"
                  fontWeight={500}
                >
                  {s.name}
                </text>
                <text
                  x={x}
                  y={s.stationNumber % 2 === 0 ? Y + 18 : Y - 12}
                  textAnchor="middle"
                  className="fill-muted select-none font-mono"
                  fontSize="9"
                >
                  {s.stationNumber}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-6 bg-metro-blue" aria-hidden="true" /> Elevated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1 w-6 rounded-sm bg-navy" aria-hidden="true" /> Underground
        </span>
        {upcomingList.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-6 border-t-2 border-dashed border-upcoming"
              aria-hidden="true"
            />{' '}
            Under construction
          </span>
        )}
      </div>

      {/* Station list */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">All stations in order</h3>
        <button
          type="button"
          onClick={() => setDescending((v) => !v)}
          className="btn btn-secondary h-11 px-3 text-sm"
          aria-label={
            descending ? 'Sort ascending by station number' : 'Sort descending by station number'
          }
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
          #{descending ? `${ordered.length} → 1` : `1 → ${ordered.length}`}
        </button>
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {displayList.map((s) => (
          <li key={s.id}>
            <Link
              href={`/stations/${s.id}`}
              className="card km-card-lift flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:shadow-elevated hover:ring-1 hover:ring-metro-blue/40"
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold',
                  s.status === 'operational'
                    ? s.type === 'elevated'
                      ? 'bg-metro-blue text-white'
                      : 'bg-navy text-white'
                    : 'bg-upcoming/15 text-upcoming'
                )}
                aria-hidden="true"
              >
                {s.stationNumber}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.name}</span>
                <span className="block truncate text-xs text-muted">{s.nameHindi}</span>
              </span>
              <span
                className={cn(
                  'badge shrink-0',
                  s.status === 'operational'
                    ? s.type === 'elevated'
                      ? 'bg-metro-blue/10 text-metro-blue'
                      : 'bg-navy/10 text-navy'
                    : 'bg-upcoming/10 text-upcoming'
                )}
              >
                {s.status === 'operational'
                  ? s.type === 'elevated'
                    ? 'Elevated'
                    : 'Underground'
                  : 'Upcoming'}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
