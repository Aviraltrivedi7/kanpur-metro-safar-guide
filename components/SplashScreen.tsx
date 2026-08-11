'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MetroLineAnim } from './MetroLineAnim';
import { useSplashLogic } from '@/hooks/useSplashLogic';

interface Props {
  children: React.ReactNode;
}

/**
 * Startup splash — overlay on top of the app.
 *
 * CRITICAL: children are ALWAYS rendered (splash is a fixed overlay, never a gate).
 * If JS is disabled, the splash simply never appears — user sees the site.
 * Never shown on internal SPA navigation or repeat visits in the same tab session.
 */
export function SplashScreen({ children }: Props) {
  const { shouldShow, isFirstSession, prefersReducedMotion, markAppReady } = useSplashLogic();
  const readyRef = useRef(false);

  // Mark app ready after first paint (two RAFs = after layout+paint of children).
  useEffect(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        markAppReady();
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [markAppReady]);

  // Not a fresh session-load → render children directly, no splash at all.
  if (!isFirstSession) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ─── SPLASH OVERLAY ─── */}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A] select-none"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: prefersReducedMotion ? 0.2 : 0.4, ease: 'easeInOut' },
            }}
            role="status"
            aria-label="Kanpur Metro Safar Guide loading"
            aria-busy="true"
          >
            <div className="flex w-full max-w-sm flex-col items-center gap-6 px-8">
              {/* ── Metro Line Animation ── */}
              <div className="w-full">
                <MetroLineAnim reducedMotion={prefersReducedMotion} />
              </div>

              {/* ── Brand Text ── */}
              <div className="space-y-1 text-center">
                <motion.p
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.35,
                    delay: prefersReducedMotion ? 0 : 1.25,
                    ease: 'easeOut',
                  }}
                >
                  KANPUR METRO
                </motion.p>

                {/* div-as-heading: avoids a duplicate h1 in the DOM alongside the page's h1 */}
                <motion.div
                  role="heading"
                  aria-level={1}
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.4,
                    delay: prefersReducedMotion ? 0 : 1.45,
                    ease: 'easeOut',
                  }}
                >
                  Safar Guide
                </motion.div>

                <motion.p
                  className="mt-2 text-sm font-medium tracking-wide text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.35,
                    delay: prefersReducedMotion ? 0.1 : 1.75,
                    ease: 'easeOut',
                  }}
                >
                  Plan. Travel. Explore.
                </motion.p>
              </div>

              {/* ── Subtle creator credit ── */}
              <motion.p
                className="absolute bottom-8 text-[11px] text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0.2 : 1.9, duration: 0.3 }}
              >
                An independent project by Aviral Trivedi
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ACTUAL APP CONTENT — always rendered to the DOM ─── */}
      {/* SSR/bots/no-JS users see the site; overlay just sits on top while visible. */}
      <div aria-hidden={shouldShow} style={{ pointerEvents: shouldShow ? 'none' : 'auto' }}>
        {children}
      </div>
    </>
  );
}
