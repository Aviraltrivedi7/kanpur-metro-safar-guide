/**
 * Service worker — offline support for Kanpur Metro Safar Guide.
 *
 * v2 hardening (fixes stale-cache breakage seen while the dev server was
 * restarted/rebuilt under an open browser):
 *   1. Version-bumped cache name — on activation every older cache is deleted,
 *      which purges stale HTML from previous builds out of returning users'
 *      browsers automatically.
 *   2. Only successful (res.ok) responses are cached. Error responses
 *      (404/500 for deleted build chunks, dead-server pages) are never stored,
 *      so a poisoned entry can no longer be served forever.
 *   3. Precache is limited to the offline shell and each entry is cached
 *      independently — cache.addAll is atomic and one failed request would
 *      otherwise abort the whole install (e.g. while the server is starting).
 *   4. Navigations: network-first, cached copy fallback, offline shell last.
 *   5. Same-origin GETs only; cross-origin traffic is never intercepted.
 */

const CACHE_NAME = 'kms-metro-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          [OFFLINE_URL].map((url) =>
            fetch(new Request(url, { cache: 'reload' }))
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch(() => {
                /* a failed precache entry must not block installation */
              })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Documents: network-first so pages (and the build chunk URLs they embed)
  // stay fresh; cached copy only when the network is unavailable.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets (immutable /_next/static chunks, icons, fonts):
  // stale-while-revalidate, never caching error responses.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((res) => {
          if (res.ok && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
