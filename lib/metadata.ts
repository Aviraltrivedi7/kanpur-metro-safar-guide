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
  // Raw page title — the root layout's title template appends the site name,
  // so it must NOT already contain it (that produced doubled suffixes).
  // OG/Twitter cards do not go through the template, so they need the full form.
  const fullTitle = options.title
    ? `${options.title} — ${SITE_NAME}`
    : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = options.description ?? SITE_TAGLINE;
  const url = absoluteUrl(options.path ?? '');

  const metadata: Metadata = {
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };

  // Omit (don't set undefined) so the root layout's default title applies.
  if (options.title) metadata.title = options.title;
  return metadata;
}
