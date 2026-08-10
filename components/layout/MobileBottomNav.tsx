'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, MapPin, RadioTower, Ticket, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stations', label: 'Stations', icon: MapPin },
  { href: '/metro-map', label: 'Map', icon: Map },
  { href: '/live', label: 'Live', icon: RadioTower },
  { href: '/fare', label: 'Fare', icon: Ticket },
  { href: '/explore', label: 'Explore', icon: Compass },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-app bg-card/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-6">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-medium',
                  active ? 'text-metro-blue' : 'text-muted'
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {href === '/live' && (
                    <span
                      className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-metro-blue"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="max-w-full truncate px-0.5">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
