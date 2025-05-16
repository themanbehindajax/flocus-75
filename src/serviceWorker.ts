
// Service worker for offline capabilities and caching

// Define which assets to cache
const CACHE_NAME = 'produtivo-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
];

// Install service worker and cache assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached assets when offline
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request since it can only be used once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response since it can only be used once
            const responseToCache = response.clone();
            
            // Add the new response to cache for future offline use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Fallback for when network is completely unavailable
            // You could return a custom offline page here
          });
      })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event: any) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

export {};
