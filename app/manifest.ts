import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'KM Safar',
    description: SITE_TAGLINE,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0F172A',
    theme_color: '#1D4ED8',
    lang: 'en',
    categories: ['travel', 'navigation', 'utilities'],
    icons: [
      { src: '/logo.png', sizes: '1024x1024', type: 'image/png' },
      { src: '/logo.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
