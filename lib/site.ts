/**
 * lib/site.ts
 * Site-wide constants and URL helpers.
 */

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Kanpur Metro Safar Guide';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const SITE_TAGLINE = 'Your independent guide to Kanpur Metro — routes, fares, timings and stations.';
export const UPMRC_DISCLAIMER =
  'This website is NOT affiliated with, endorsed by, or connected to UPMRC.';

export function absoluteUrl(path = ''): string {
  const base = SITE_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
