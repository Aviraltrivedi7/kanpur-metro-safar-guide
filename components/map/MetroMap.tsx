'use client';

import { useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { operationalStations, upcomingStations, type Station } from '@/services/metro';
import { cn } from '@/lib/utils';

const X_STEP = 78;
const X_START = 60;
const Y = 140;

function xFor(stationNumber: number): number {
  return X_START + (stationNumber - 1) * X_STEP;
}

export function MetroMap() {
  const [selected, setSelected] = useState<Station | null>(null);
  const [zoom, setZoom] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const totalWidth = xFor(upcomingStations[upcomingStations.length - 1].stationNumber) + 80;
  // Distance the map train covers per loop — exactly the operational segment.
  const trainTravel = xFor(operationalStations[operationalStations.length - 1].stationNumber) - xFor(1);

  const viewBox = useMemo(() => `0 0 ${totalWidth} 300`, [totalWidth]);

  function renderStation(s: Station) {
    const x = xFor(s.stationNumber);
    const upcoming = s.status !== 'operational';
    const isSelected = selected?.id === s.id;

    return (
      <g key={s.id}>
        <button
          type="button"
          aria-label={`${s.name}${upcoming ? ' (under construction)' : ''}`}
          onClick={() => setSelected(s)}
          className="cursor-pointer"
        >
          {/* Transparent 44px hit area so touch taps never miss the 16px dot */}
          <circle cx={x} cy={Y} r={22} fill="transparent" />
          <circle
            cx={x}
            cy={Y}
            r={isSelected ? 11 : 8}
            className={cn(
              'transition-all duration-150',
              upcoming
                ? 'fill-card stroke-upcoming'
                : isSelected
                  ? 'fill-metro-blue stroke-metro-blue'
                  : 'fill-card stroke-metro-blue'
            )}
            strokeWidth={isSelected ? 4 : 3}
            strokeDasharray={upcoming ? '3 3' : undefined}
          />
        </button>
        <text
          x={x}
          y={s.stationNumber % 2 === 0 ? Y + 38 : Y - 28}
          textAnchor="middle"
          className={cn('select-none', upcoming ? 'fill-upcoming' : 'fill-ink')}
          fontSize="11"
          fontWeight={isSelected ? 700 : 500}
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
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-metro-blue bg-card" aria-hidden="true" />
            Operational
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-dashed border-upcoming bg-card" aria-hidden="true" />
            Under construction
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-6 bg-metro-blue" aria-hidden="true" />
            Elevated
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-6 rounded-sm bg-navy" aria-hidden="true" />
            Underground
          </span>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Zoom controls">
          <button type="button" className="btn btn-secondary h-11 w-11 p-0 text-base" onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="btn btn-secondary h-11 w-11 p-0 text-base" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="btn btn-secondary h-11 px-3 text-sm" onClick={() => setZoom(1)}>
            Reset
          </button>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="card overflow-x-auto no-scrollbar"
        role="application"
        aria-label="Kanpur Metro line map"
        tabIndex={0}
      >
        <svg
          viewBox={viewBox}
          width={totalWidth * zoom}
          height={300 * zoom}
          className="mx-auto block"
          role="img"
          aria-label="Kanpur Metro Corridor 1 — 14 operational stations from IIT Kanpur to Kanpur Central, 7 more under construction toward Naubasta"
        >
          {/* Operational segment — elevated (stations 1–9) */}
          <line x1={xFor(1)} y1={Y} x2={xFor(9)} y2={Y} stroke="var(--color-metro-blue)" strokeWidth="5" strokeLinecap="round" />
          {/* Operational underground segment (stations 9–14) */}
          <line x1={xFor(9)} y1={Y} x2={xFor(14)} y2={Y} stroke="var(--color-navy)" strokeWidth="7" strokeLinecap="round" />
          {/* Under-construction extension (stations 14–21) — dashed */}
          <line
            x1={xFor(14)}
            y1={Y}
            x2={xFor(21)}
            y2={Y}
            stroke="var(--color-upcoming)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 8"
          />

          {operationalStations.map(renderStation)}
          {upcomingStations.map(renderStation)}

          {/* Decorative train gliding along the operational segment —
              pointer-events: none keeps it from stealing station taps, and
              prefers-reduced-motion hides it entirely. */}
          <g
            className="km-map-train"
            style={{ ['--km-travel' as string]: `${trainTravel}px` }}
            aria-hidden="true"
          >
            <rect x={xFor(1) - 26} y={Y - 11} width="52" height="22" rx="7" fill="var(--color-metro-blue)" />
            <rect x={xFor(1) - 20} y={Y - 6} width="14" height="9" rx="3" fill="#ffffff" opacity="0.85" />
            <circle cx={xFor(1) - 16} cy={Y + 12} r="3.5" fill="var(--color-metro-blue)" />
            <circle cx={xFor(1) + 16} cy={Y + 12} r="3.5" fill="var(--color-metro-blue)" />
          </g>
        </svg>
      </div>

      {/* Selected station panel */}
      {selected && (
        <div className="card km-panel-in p-4" role="status">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{selected.name} <span className="ml-1 text-sm font-normal text-muted">{selected.nameHindi}</span></p>
              <p className="mt-1 text-sm text-muted">
                Station #{selected.stationNumber} &middot; {selected.type === 'elevated' ? 'Elevated' : 'Underground'} &middot;{' '}
                {selected.status === 'operational' ? (
                  <span className="font-medium text-operational">Operational</span>
                ) : (
                  <span className="font-medium text-upcoming">Under construction</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {selected.status === 'operational' && (
                <>
                  <Link href={`/stations/${selected.id}`} className="btn btn-secondary h-9 px-3 text-sm">
                    Station details
                  </Link>
                  <Link href={`/journey?from=${selected.id}`} className="btn btn-primary h-9 px-3 text-sm">
                    Plan from here
                  </Link>
                </>
              )}
              <button type="button" onClick={() => setSelected(null)} className="btn btn-secondary h-9 px-3 text-sm" aria-label="Close station info">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
