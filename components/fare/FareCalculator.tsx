'use client';

import { useMemo, useState } from 'react';
import { Ticket } from 'lucide-react';
import { FARE_DISCLAIMER, calculateFare, fareSlabs, operationalStations } from '@/services/metro';

export function FareCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const stops = useMemo(() => {
    const a = operationalStations.find((s) => s.id === from);
    const b = operationalStations.find((s) => s.id === to);
    if (!a || !b) return 0;
    return Math.abs(a.stationNumber - b.stationNumber);
  }, [from, to]);

  const result = stops > 0 ? calculateFare(stops) : null;

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Ticket className="h-5 w-5 text-metro-blue" aria-hidden="true" />
        Fare Calculator
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

      {result && (
        <div className="mt-4 rounded-md bg-surface p-4" aria-live="polite">
          {result.fare !== null ? (
            <p className="text-center">
              <span className="block text-xs text-muted">{result.stops} stop{result.stops === 1 ? '' : 's'}</span>
              <span className="block text-3xl font-bold text-metro-blue">₹{result.fare}</span>
              <span className="text-xs text-muted">estimated ticket fare</span>
            </p>
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
          {fareSlabs.map((s) => (
            <tr key={s.minStops} className="border-b border-app last:border-0">
              <td className="py-2 pr-4">
                {s.minStops}{s.maxStops === Infinity ? '+' : s.minStops === s.maxStops ? '' : `–${s.maxStops}`}
              </td>
              <td className="py-2 font-semibold">₹{s.fare}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
