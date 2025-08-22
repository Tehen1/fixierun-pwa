const CACHE_NAME = 'fixierun-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.tailwindcss.com',
  'https://kit.fontawesome.com/a076d05399.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Installation du service worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache: Network First pour les tuiles de carte, Cache First pour les assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Stratégie spéciale pour les tuiles de carte OpenStreetMap
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          // Cache la tuile pour usage hors ligne
          cache.put(event.request, response.clone());
          return response;
        }).catch(() => {
          // Retourne depuis le cache si network fail
          return cache.match(event.request);
        });
      })
    );
    return;
  }

  // Cache First pour les autres ressources
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        // console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Cache les nouvelles ressources
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// Gérer les messages depuis l'app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
