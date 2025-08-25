const CACHE_NAME = 'fixierun-v1.2.0';
const BASE_PATH = '/fixierun-pwa';

const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/offline.html`
];

const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.tailwindcss.com',
  'https://kit.fontawesome.com/a076d05399.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  console.log('🔧 SW: Installing v1.2.0…');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(`${CACHE_NAME}-cdn`).then(async cache => {
        await Promise.all(CDN_ASSETS.map(async url => {
          try {
            const response = await fetch(url);
            if (response.ok) await cache.put(url, response);
          } catch (e) {
            console.warn(`SW: Échec cache ${url}`, e);
          }
        }));
      })
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  if (CDN_ASSETS.some(asset => event.request.url.includes(new URL(asset).hostname))) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }

  event.respondWith(cacheFirstStrategy(event.request));
});

async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cache.match(request) || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(`${CACHE_NAME}-cdn`);
  const cached = await cache.match(request);
  const network = fetch(request).then(resp => {
    if (resp.ok) cache.put(request, resp.clone());
    return resp;
  }).catch(() => cached);
  return cached || network;
}

async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    if (request.mode === 'navigate') {
      return cache.match(`${BASE_PATH}/offline.html`);
    }
    throw Error('Network error');
  }
}
