import type { Metadata } from 'next';
import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/site';

/**
 * Build per-page metadata with sensible fallbacks.
 */
export function buildMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
} = {}): Metadata {
  const title = options.title ? `${options.title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = options.description ?? SITE_TAGLINE;
  const url = absoluteUrl(options.path ?? '');

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
