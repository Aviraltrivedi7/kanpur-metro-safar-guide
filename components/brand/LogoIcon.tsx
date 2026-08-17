'use client';

import { useId } from 'react';

interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — brand mark.
 * Bold side-view metro train: blue-gradient body, white windows,
 * amber speed stripe, motion lines, rail beneath.
 * useId-scoped gradient IDs — safe for multiple instances per page.
 */
export function LogoIcon({ className }: LogoIconProps) {
  const uid = useId();
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

      {/* Motion lines — suggest speed */}
      <line x1="2" y1="15" x2="9" y2="15" stroke="#FBBF24" strokeWidth={1.8} strokeLinecap="round" opacity={0.35} />
      <line x1="4" y1="21" x2="11" y2="21" stroke="#FBBF24" strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      <line x1="2" y1="27" x2="9" y2="27" stroke="#FBBF24" strokeWidth={1.8} strokeLinecap="round" opacity={0.35} />

      {/* Train body */}
      <rect x="12" y="8" width="26" height="24" rx={5} fill={`url(#${bodyGrad})`} filter={`url(#${glow})`} />

      {/* Front nose — aerodynamic pointed right edge */}
      <path d="M38 8 Q44 8 44 20 Q44 32 38 32" fill={`url(#${bodyGrad})`} />

      {/* Windows — three rounded panes */}
      <rect x="15" y="12" width="6" height="7" rx={1.5} fill="white" opacity={0.92} />
      <rect x="23" y="12" width="6" height="7" rx={1.5} fill="white" opacity={0.92} />
      <rect x="31" y="12" width="6" height="7" rx={1.5} fill="white" opacity={0.92} />

      {/* Door seams */}
      <line x1="22" y1="8" x2="22" y2="32" stroke="white" strokeWidth={0.8} opacity={0.12} />
      <line x1="30" y1="8" x2="30" y2="32" stroke="white" strokeWidth={0.8} opacity={0.12} />

      {/* Amber speed stripe — lower body accent */}
      <rect x="12" y="28" width="26" height={3.5} rx={1.5} fill={`url(#${amberGrad})`} />

      {/* Rail / track */}
      <rect x="3" y="38" width="42" height={2.5} rx={1.25} fill={`url(#${amberGrad})`} opacity={0.7} />

      {/* Track ties */}
      <rect x="8" y="41.5" width={3} height={2} rx={1} fill="#F59E0B" opacity={0.45} />
      <rect x="18" y="41.5" width={3} height={2} rx={1} fill="#F59E0B" opacity={0.45} />
      <rect x="28" y="41.5" width={3} height={2} rx={1} fill="#F59E0B" opacity={0.45} />
      <rect x="38" y="41.5" width={3} height={2} rx={1} fill="#F59E0B" opacity={0.45} />
    </svg>
  );
}
