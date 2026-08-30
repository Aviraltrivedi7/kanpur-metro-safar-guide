'use client';

import Image from 'next/image';

interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — brand mark.
 * The official emblem image, shown complete (never cropped).
 * Sized by the parent; object-contain keeps the full circle visible.
 */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Image
      src="/icons/logo-512.png"
      alt="Kanpur Metro Safar Guide logo"
      width={64}
      height={64}
      className={`h-full w-full object-contain ${className ?? ''}`}
      priority
      sizes="(max-width: 768px) 44px, 56px"
    />
  );
}
