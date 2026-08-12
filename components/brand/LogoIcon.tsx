'use client';

import { useId } from 'react';

interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — premium brand mark.
 * Abstract metro "M" formed by two converging tracks, with a dark
 * train car at the junction. Amber speed-bar below = motion line.
 * Uses useId so multiple instances never collide on SVG def IDs.
 */
export function LogoIcon({ className }: LogoIconProps) {
  const uid = useId();
  const gradBlueId = `logo-grad-blue-${uid}`;
  const gradAmberId = `logo-grad-amber-${uid}`;
  const glowId = `logo-glow-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradBlueId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id={gradAmberId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left rail */}
      <path
        d="M6 6 L6 30"
        stroke={`url(#${gradBlueId})`}
        strokeWidth={3.5}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      {/* Right rail */}
      <path
        d="M42 6 L42 30"
        stroke={`url(#${gradBlueId})`}
        strokeWidth={3.5}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      {/* Cross span of the M */}
      <path
        d="M6 6 L24 24"
        stroke={`url(#${gradBlueId})`}
        strokeWidth={3.5}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <path
        d="M42 6 L24 24"
        stroke={`url(#${gradBlueId})`}
        strokeWidth={3.5}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      {/* Train car at junction */}
      <rect
        x={18}
        y={16}
        width={12}
        height={10}
        rx={2.2}
        fill="rgb(var(--rgb-metro-blue))"
      />
      <rect x={20} y={19} width={8} height={4} rx={1} fill="white" opacity={0.9} />
      <rect x={21.5} y={19.5} width={5} height={3} rx={0.5} fill="#0F172A" opacity={0.8} />

      {/* Speed line / tie-bar */}
      <rect
        x={8}
        y={34}
        width={32}
        height={4}
        rx={2}
        fill={`url(#${gradAmberId})`}
        filter={`url(#${glowId})`}
      />
      {/* Small motion ticks */}
      <rect x={12} y={40} width={6} height={2.5} rx={1.25} fill={`url(#${gradAmberId})`} opacity={0.6} />
      <rect x={22} y={40} width={6} height={2.5} rx={1.25} fill={`url(#${gradAmberId})`} opacity={0.6} />
      <rect x={32} y={40} width={4} height={2.5} rx={1.25} fill={`url(#${gradAmberId})`} opacity={0.6} />
    </svg>
  );
}
