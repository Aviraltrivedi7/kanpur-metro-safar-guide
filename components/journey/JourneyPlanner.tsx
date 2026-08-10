'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, ChevronDown, CircleDot, MapPin } from 'lucide-react';
import { operationalStations, type Station } from '@/services/metro';
import { useLanguage } from '@/context/LanguageContext';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { cn } from '@/lib/utils';

interface StationSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string) => void;
  excludeId?: string;
}

function filterStations(query: string, excludeId?: string): Station[] {
  const q = query.trim().toLowerCase();
  return operationalStations.filter(
    (s) =>
      s.id !== excludeId &&
      (q === '' || s.name.toLowerCase().includes(q) || s.nameHindi.includes(query.trim()))
  );
}

function StationOption({
  station,
  selected,
  onPick,
}: {
  station: Station;
  selected: boolean;
  onPick: () => void;
}) {
  return (
    <li role="option" aria-selected={selected}>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPick}
      >
        <CircleDot className="h-3.5 w-3.5 shrink-0 text-metro-blue" aria-hidden="true" />
        <span>
          {station.name}
          <span className="ml-2 text-xs text-muted">{station.nameHindi}</span>
        </span>
      </button>
    </li>
  );
}

function StationSelect({ id, label, value, onChange, excludeId }: StationSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sheetInputRef = useRef<HTMLInputElement>(null);

  const selected: Station | undefined = useMemo(
    () => operationalStations.find((s) => s.id === value),
    [value]
  );

  const options = useMemo(() => filterStations(query, excludeId), [query, excludeId]);

  function handleBlur(e: React.FocusEvent) {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  function pick(id: string) {
    onChange(id);
    setOpen(false);
    setSheetOpen(false);
    setQuery('');
  }

  return (
    <div ref={wrapperRef} className="relative" onBlur={handleBlur}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>

      {/* Desktop: combobox input with inline dropdown */}
      <div className="relative hidden md:block">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          className={cn('input pl-10 pr-9', open && 'border-metro-blue')}
          placeholder="Search station…"
          value={open ? query : selected ? selected.name : query}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>

      {/* Mobile (<768px): read-only trigger that opens the bottom sheet */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${label}: ${selected ? selected.name : 'choose station'}`}
        className="input relative flex min-h-[48px] w-full items-center pl-10 pr-9 text-left text-base md:hidden"
      >
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <span className={cn('truncate', !selected && 'text-muted')}>
          {selected ? selected.name : 'Station chuno…'}
        </span>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </button>

      {/* Desktop dropdown */}
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-md border border-app bg-card shadow-elevated md:block"
        >
          {options.length === 0 && (
            <li className="px-3 py-3 text-sm text-muted">No stations match your search.</li>
          )}
          {options.map((s) => (
            <StationOption key={s.id} station={s} selected={s.id === value} onPick={() => pick(s.id)} />
          ))}
        </ul>
      )}

      {/* Mobile bottom sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={label}
        autoFocusRef={sheetInputRef}
      >
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={sheetInputRef}
            type="text"
            className="input min-h-[48px] pl-10 text-base"
            placeholder="Search station…"
            aria-label={`Search ${label}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul role="listbox" aria-label={label} className="mt-2 divide-y divide-app">
          {options.length === 0 && (
            <li className="px-3 py-3 text-sm text-muted">No stations match your search.</li>
          )}
          {options.map((s) => (
            <StationOption key={s.id} station={s} selected={s.id === value} onPick={() => pick(s.id)} />
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
}

export function JourneyPlanner() {
  const router = useRouter();
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const canPlan = from !== '' && to !== '' && from !== to;

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPlan) return;
    router.push(`/journey?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full max-w-2xl p-4 sm:p-6"
      aria-label="Plan your journey"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <StationSelect id="planner-from" label={t('planner.from')} value={from} onChange={setFrom} excludeId={to} />
        <button
          type="button"
          onClick={handleSwap}
          aria-label={t('planner.swap')}
          className="btn btn-secondary mx-auto h-11 w-11 rounded-full p-0 sm:mb-0.5"
        >
          {/* On phones rotate the arrow so it reads top→bottom like the stacked fields */}
          <ArrowLeftRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" />
        </button>
        <StationSelect id="planner-to" label={t('planner.to')} value={to} onChange={setTo} excludeId={from} />
      </div>
      <button
        type="submit"
        disabled={!canPlan}
        className={cn('btn btn-primary mt-4 min-h-[48px] w-full text-base', !canPlan && 'cursor-not-allowed opacity-50')}
      >
        {t('planner.plan')}
      </button>
    </form>
  );
}
