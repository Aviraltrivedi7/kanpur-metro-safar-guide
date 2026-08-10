interface LogoIconProps {
  className?: string;
}

/**
 * Kanpur Metro Safar Guide — logomark.
 * Two metro rails joined by a centre span forming an "M", with an amber tie below.
 * Reused in the navbar wordmark and any branding spots. aria-hidden in navbar.
 */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Left rail */}
      <path d="M5 5v9" />
      {/* Right rail */}
      <path d="M19 5v9" />
      {/* Centre span of the M */}
      <path d="M5 5l7 5.5" />
      <path d="M19 5l-7 5.5" />
      {/* Amber tie-bar below */}
      <rect x="7" y="16.5" width="10" height="2.5" rx="1" fill="#f59e0b" stroke="none" />
    </svg>
  );
}
