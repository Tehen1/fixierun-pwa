const CACHE_NAME = 'fixierun-v1.2.0';
const BASE_PATH = '/fixierun-pwa'; // Adapté à votre GitHub Pages

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

// Installation avec retry logic
self.addEventListener('install', event => {
  console.log('🔧 SW: Installing v1.2.0...');
  event.waitUntil(
    Promise.all([
      // Cache assets statiques
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(STATIC_ASSETS)
      ),
      // Cache CDN avec gestion d'erreur
      caches.open(`${CACHE_NAME}-cdn`).then(async cache => {
        const promises = CDN_ASSETS.map(async url => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (error) {
            console.warn(`Failed to cache ${url}:`, error);
          }
        });
        return Promise.all(promises);
      })
    ]).then(() => {
      console.log('✅ SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Stratégie optimisée
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Tuiles de carte - Network First
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // CDN - Stale While Revalidate
  if (CDN_ASSETS.some(asset => event.request.url.includes(new URL(asset).hostname))) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }
  
  // Assets statiques - Cache First
  event.respondWith(cacheFirstStrategy(event.request));
});

// Stratégies de cache
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cache.match(request) || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(`${CACHE_NAME}-cdn`);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fallback vers page offline
    if (request.mode === 'navigate') {
      return cache.match(`${BASE_PATH}/offline.html`);
    }
    throw error;
  }
}
