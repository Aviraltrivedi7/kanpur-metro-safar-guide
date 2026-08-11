interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — official logo.
 * The user-provided brand mark (train + Kanpur skyline + "KANPUR METRO SAFAR GUIDE").
 * Used in the navbar wordmark and any branding spot. aria-hidden in navbar.
 */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <img
      src="/logo.png"
      alt="Kanpur Metro Safar Guide official logo"
      width={32}
      height={32}
      className={className ?? 'h-8 w-8 rounded-md object-cover'}
    />
  );
}
