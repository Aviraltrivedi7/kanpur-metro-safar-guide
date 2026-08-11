'use client';

import { motion } from 'framer-motion';

interface Props {
  reducedMotion?: boolean;
}

// Station positions along the line (percent of SVG width).
// First + last are termini (slightly larger dots).
const STATIONS = [0, 22, 44, 66, 88, 100];

/**
 * Landing splash animation — pure SVG + Framer Motion.
 * Route line draws left→right, station dots appear in sequence,
 * a small train rides across. Under reduced-motion everything is static.
 */
export function MetroLineAnim({ reducedMotion = false }: Props) {
  // Reduced motion: static line + dots only — no movement.
  if (reducedMotion) {
    return (
      <svg width="100%" height="40" viewBox="0 0 400 40" aria-hidden="true">
        <line x1="0" y1="20" x2="400" y2="20" stroke="#1D4ED8" strokeWidth="2" opacity="0.7" />
        {STATIONS.map((pct, i) => (
          <circle
            key={i}
            cx={(pct / 100) * 400}
            cy={20}
            r={i === 0 || i === STATIONS.length - 1 ? 7 : 5}
            fill="#1D4ED8"
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      width="100%"
      height="40"
      viewBox="0 0 400 40"
      aria-hidden="true"
      className="mx-auto max-w-xs sm:max-w-sm"
    >
      {/* Route line — draws left to right */}
      <motion.line
        x1="0"
        y1="20"
        x2="400"
        y2="20"
        stroke="#1D4ED8"
        strokeWidth="2"
        opacity={0.7}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
      />

      {/* Station dots — appear sequentially */}
      {STATIONS.map((pct, i) => {
        const cx = (pct / 100) * 400;
        const isTerminus = i === 0 || i === STATIONS.length - 1;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={20}
            r={isTerminus ? 7 : 5}
            fill="#1D4ED8"
            stroke="#fff"
            strokeWidth={isTerminus ? 2 : 1.5}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.5 + i * 0.1, ease: 'backOut' }}
          />
        );
      })}

      {/* Metro train — rides across, exits right edge */}
      <motion.g
        initial={{ x: -30 }}
        animate={{ x: 415 }}
        transition={{ duration: 0.9, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Train body */}
        <rect x={-16} y={12} width={28} height={16} rx={4} fill="#F59E0B" />
        {/* Train window */}
        <rect x={-12} y={15} width={10} height={7} rx={2} fill="#fff" opacity={0.9} />
        {/* Front direction indicator */}
        <polygon points="12,20 16,17 16,23" fill="#F59E0B" />
      </motion.g>
    </svg>
  );
}
