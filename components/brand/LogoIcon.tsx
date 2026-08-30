'use client';

import { useId } from 'react';

interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — brand mark.
 * Grounded side-view metro train: gradient body with sloped cab front,
 * wraparound driver windshield, twin passenger windows, amber skirt stripe,
 * steel wheels touching the rail. useId-scoped defs so multiple
 * instances (navbar + footer) never collide on gradient IDs.
 */
export function LogoIcon({ className }: LogoIconProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bodyGrad = `km-body-${uid}`;
  const amberGrad = `km-amber-${uid}`;
  const glow = `km-glow-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id={amberGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id={glow} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Speed lines behind the train */}
      <line x1="1.5" y1="14" x2="7.5" y2="14" stroke={`url(#${amberGrad})`} strokeWidth={1.8} strokeLinecap="round" opacity={0.35} />
      <line x1="3" y1="19" x2="8" y2="19" stroke={`url(#${amberGrad})`} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
      <line x1="1.5" y1="24" x2="7.5" y2="24" stroke={`url(#${amberGrad})`} strokeWidth={1.8} strokeLinecap="round" opacity={0.35} />

      {/* Body — rounded rear, sloped metro cab front */}
      <path
        d="M13 9 H32 Q40 9 43 17 V26 Q43 31 38 31 H13 Q9 31 9 27 V13 Q9 9 13 9 Z"
        fill={`url(#${bodyGrad})`}
        filter={`url(#${glow})`}
      />

      {/* Wraparound driver windshield */}
      <path
        d="M32.5 12.5 Q37.5 12.5 40.3 17.8 V20.5 H32.5 Z"
        fill="#0F172A"
        opacity={0.88}
      />

      {/* Passenger windows */}
      <rect x="13.5" y="13" width="8" height="6.5" rx={2} fill="white" opacity={0.92} />
      <rect x="24" y="13" width="6.5" height="6.5" rx={2} fill="white" opacity={0.92} />

      {/* Amber skirt stripe */}
      <rect x="11" y="25" width="29" height="3.2" rx={1.6} fill={`url(#${amberGrad})`} />

      {/* Wheels — steel rim + amber hub, touching the rail */}
      <circle cx="16" cy="32" r={2.8} fill="#334155" stroke="#94A3B8" strokeWidth={0.9} />
      <circle cx="16" cy="32" r={1.05} fill="#FBBF24" />
      <circle cx="34" cy="32" r={2.8} fill="#334155" stroke="#94A3B8" strokeWidth={0.9} />
      <circle cx="34" cy="32" r={1.05} fill="#FBBF24" />

      {/* Rail */}
      <rect x="4" y="35" width="40" height="2.6" rx={1.3} fill={`url(#${amberGrad})`} opacity={0.85} />

      {/* Track ties */}
      <rect x="7" y="39" width="3.2" height="2" rx={0.8} fill="#F59E0B" opacity={0.45} />
      <rect x="17" y="39" width="3.2" height="2" rx={0.8} fill="#F59E0B" opacity={0.45} />
      <rect x="27" y="39" width="3.2" height="2" rx={0.8} fill="#F59E0B" opacity={0.45} />
      <rect x="37" y="39" width="3.2" height="2" rx={0.8} fill="#F59E0B" opacity={0.45} />
    </svg>
  );
}
