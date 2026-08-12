import Link from 'next/link';
import { LogoIcon } from '@/components/brand/LogoIcon';
import { UPMRC_DISCLAIMER } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-app bg-card">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-navy via-metro-blue to-navy p-[4px] shadow-card"
                aria-hidden="true"
              >
                <span className="flex h-full w-full items-center justify-center rounded-[8px] bg-white">
                  <LogoIcon className="h-8 w-8" />
                </span>
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">KANPUR METRO</p>
                <p className="text-xs tracking-[0.2em] text-muted">SAFAR GUIDE</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Independent travel guide. Not affiliated with UPMRC.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Guide</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/stations" className="hover:text-ink">Station Directory</Link></li>
              <li><Link href="/routes" className="hover:text-ink">Routes</Link></li>
              <li><Link href="/metro-map" className="hover:text-ink">Metro Map</Link></li>
              <li><Link href="/journey" className="hover:text-ink">Plan a Journey</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Information</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/fare" className="hover:text-ink">Fare Guide</Link></li>
              <li><Link href="/timings" className="hover:text-ink">Timings</Link></li>
              <li><Link href="/information" className="hover:text-ink">Travel Information</Link></li>
              <li><Link href="/faq" className="hover:text-ink">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/explore" className="hover:text-ink">Places near the Metro</Link></li>
              <li><Link href="/about" className="hover:text-ink">About this Guide</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-app pt-6">
          <p className="text-xs leading-relaxed text-muted">{UPMRC_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
