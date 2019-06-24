const CACHE_NAME = 'restuarant-cache-v1';
// var urlsToCache = [
//   '/'
// '/css',
// '/data',
// '/img',
// '/js',
// '/sw',
//   '../'
// ];

self.addEventListener('install', (event) => {
  console.log(`Service Worker: Installed`);
  // // Perform install steps
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then(function (cache) {
  //       console.log('Opened cache');
  //       return cache.addAll(urlsToCache);
  //     })
  // );
});

self.addEventListener('activate', (event) => {
  console.log(`Service Worker: Activated`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log(`Service Worker: Fetch`);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          let responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
        );
      })
  );
});