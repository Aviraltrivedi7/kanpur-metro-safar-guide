interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — official logo.
 * The user-provided brand mark (train + Kanpur skyline + "KANPUR METRO SAFAR GUIDE").
 * MUST render the full image without cropping: object-contain keeps the whole
 * badge visible inside whatever box the parent gives it.
 */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <img
      src="/logo.png"
      alt="Kanpur Metro Safar Guide official logo"
      className={className ?? 'h-10 w-auto object-contain'}
    />
  );
}
