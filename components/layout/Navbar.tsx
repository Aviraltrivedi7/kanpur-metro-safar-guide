'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LogoIcon } from '@/components/brand/LogoIcon';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', key: 'nav.home' as const },
  { href: '/live', key: 'nav.live' as const },
  { href: '/stations', key: 'nav.stations' as const },
  { href: '/routes', key: 'nav.routes' as const },
  { href: '/fare', key: 'nav.fare' as const },
  { href: '/metro-map', key: 'nav.map' as const },
  { href: '/explore', key: 'nav.explore' as const },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-app bg-card/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-md px-1 py-1 -ml-1"
          aria-label="Kanpur Metro Safar Guide home"
        >
          <span
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy via-metro-blue to-navy p-[3px] shadow-card transition-all duration-300 hover:scale-105 hover:shadow-metro-glow hover:ring-2 hover:ring-metro-blue/50"
            aria-hidden="true"
          >
            <span className="flex h-full w-full items-center justify-center rounded-[9px] bg-white">
              <LogoIcon className="h-6 w-6" />
            </span>
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-bold tracking-wide">{t('wordmark.line1')}</span>
            <span className="hidden text-[11px] font-medium tracking-[0.2em] text-muted min-[480px]:block">
              {t('wordmark.line2')}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                  active ? 'bg-metro-blue text-white' : 'text-muted hover:bg-surface hover:text-ink'
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            className="btn-secondary btn h-10 w-10 p-0 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-app bg-card md:hidden" aria-label="Mobile navigation">
          <ul className="container-page space-y-1 py-3">
            {NAV_LINKS.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-3 text-base font-medium',
                      active ? 'bg-metro-blue text-white' : 'hover:bg-surface'
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
