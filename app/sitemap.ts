import type { MetadataRoute } from 'next';
import { landmarks, stations } from '@/services/metro';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/live',
    '/stations',
    '/routes',
    '/fare',
    '/timings',
    '/metro-map',
    '/explore',
    '/journey',
    '/information',
    '/about',
    '/faq',
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: (path === '' ? 'weekly' : path === '/live' ? 'daily' : 'monthly') as
      | 'weekly'
      | 'daily'
      | 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const stationPages = stations.map((s) => ({
    url: absoluteUrl(`/stations/${s.id}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const landmarkPages = landmarks.map((l) => ({
    url: absoluteUrl(`/explore/${l.id}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...stationPages, ...landmarkPages];
}
