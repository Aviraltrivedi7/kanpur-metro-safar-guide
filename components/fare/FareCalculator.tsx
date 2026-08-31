'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, MapPin, Ticket } from 'lucide-react';
import { FARE_DISCLAIMER, calculateFare, fareSlabs, operationalStations } from '@/services/metro';
import { cn } from '@/lib/utils';

export function FareCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fromStation = useMemo(() => operationalStations.find((s) => s.id === from), [from]);
  const toStation = useMemo(() => operationalStations.find((s) => s.id === to), [to]);

  const sameStation = from !== '' && from === to;
  const stops = useMemo(() => {
    if (!fromStation || !toStation) return 0;
    return Math.abs(fromStation.stationNumber - toStation.stationNumber);
  }, [fromStation, toStation]);

  const result = stops > 0 ? calculateFare(stops) : null;
  const activeSlab = result
    ? fareSlabs.find((sl) => stops >= sl.minStops && stops <= sl.maxStops)
    : undefined;

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Ticket className="h-5 w-5 text-metro-blue" aria-hidden="true" />
        Fare Calculator
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label htmlFor="fare-from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            From
          </label>
          <select id="fare-from" value={from} onChange={(e) => setFrom(e.target.value)} className="input min-h-[48px] text-base sm:min-h-0 sm:text-sm">
            <option value="">Select origin…</option>
            {operationalStations.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleSwap}
          className="btn btn-secondary h-11 w-full justify-center px-3 sm:h-9 sm:w-9 sm:p-0"
          aria-label="Swap origin and destination"
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <div>
          <label htmlFor="fare-to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            To
          </label>
          <select id="fare-to" value={to} onChange={(e) => setTo(e.target.value)} className="input min-h-[48px] text-base sm:min-h-0 sm:text-sm">
            <option value="">Select destination…</option>
            {operationalStations.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {sameStation && (
        <p className="mt-4 rounded-md bg-surface p-3 text-center text-sm text-muted" aria-live="polite">
          Origin and destination same hai — station select karke swap karein ya doosra station chunein.
        </p>
      )}

      {result && !sameStation && (
        <div className="mt-4 rounded-md bg-surface p-4" aria-live="polite">
          {result.fare !== null ? (
            <div>
              <p className="text-center">
                <span className="block text-xs text-muted">
                  {result.stops} stop{result.stops === 1 ? '' : 's'} &middot;{' '}
                  {fromStation?.name} → {toStation?.name}
                </span>
                <span className="mt-1 block text-4xl font-bold text-metro-blue tabular-nums">₹{result.fare}</span>
                <span className="text-xs text-muted">estimated ticket fare</span>
              </p>
              <Link
                href={`/journey?from=${from}&to=${to}`}
                className="btn btn-primary mt-4 h-11 w-full text-sm"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Plan this journey
              </Link>
            </div>
          ) : (
            <p className="text-center text-sm text-muted">Select two different stations to see the fare.</p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{FARE_DISCLAIMER}</p>

      <h3 className="mt-6 text-sm font-semibold">Fare Slabs (publicly reported)</h3>
      <table className="mt-2 w-full border-collapse text-sm">
        <caption className="sr-only">Kanpur Metro fare slabs by number of stops</caption>
        <thead>
          <tr className="border-b border-app text-left text-xs text-muted">
            <th scope="col" className="py-2 pr-4 font-medium">Stops travelled</th>
            <th scope="col" className="py-2 font-medium">Fare</th>
          </tr>
        </thead>
        <tbody>
          {fareSlabs.map((s) => {
            const active = activeSlab?.minStops === s.minStops;
            return (
              <tr
                key={s.minStops}
                className={cn(
                  'border-b border-app last:border-0 transition-colors duration-150',
                  active && 'bg-metro-blue/10 font-semibold'
                )}
              >
                <td className="py-2 pr-4">
                  {s.minStops}{s.maxStops === Infinity ? '+' : s.minStops === s.maxStops ? '' : `–${s.maxStops}`}
                </td>
                <td className="py-2 font-semibold">₹{s.fare}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
