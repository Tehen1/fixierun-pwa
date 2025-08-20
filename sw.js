// Version du cache - à modifier lors des mises à jour
const CACHE_VERSION = 'v1';
const CACHE_NAME = `fixierun-pwa-${CACHE_VERSION}`;

// Fichiers à mettre en cache
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des ressources principales');
        return cache.addAll(ASSETS);
      })
  );
});

// Stratégie de cache (Cache First, then Network)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Retourne la réponse en cache si disponible
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, fait la requête réseau
        return fetch(event.request)
          .then(response => {
            // Mise en cache des nouvelles ressources
            if (!event.request.url.includes('chrome-extension')) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
