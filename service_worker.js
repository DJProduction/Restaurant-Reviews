const CACHE_NAME = 'restuarant-cache-v1';
/*
  1. Team member can uncomment and give the user the entire site cache if needed on first loaded.
*/
let urlsToCache = [
  '/',
  '/index.html',
  '/service_worker.js',
  '/css/styles.css',
  '/css/responsive.css',
  '/data/restaurants.json',
  '/js/main.js',
  '/js/dbhelper.js',
  '/sw/service_worker_reg.js',
  // Only the low resolution to be initially cached to save space.
  'img/1-small.jpg',
  'img/2-small.jpg',
  'img/3-small.jpg',
  'img/4-small.jpg',
  'img/5-small.jpg',
  'img/6-small.jpg',
  'img/7-small.jpg',
  'img/8-small.jpg',
  'img/9-small.jpg',
  'img/10-small.jpg',
];

/*
  Whether given an empty array or list of urls this function will set the cache up during the install period.
*/
self.addEventListener('install', (event) => {
  console.log(`Service Worker: Installed`);
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

/*
  When service worker is actovated.
  Function checks for a new cache name from the series of availble caches pending.
  When new cache is activated clears old cache and all of its contents.
*/
self.addEventListener('activate', (event) => {
  console.log(`Service Worker: Activated`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (CACHE_NAME.indexOf(cacheName) === -1) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/*
  1: Checks to make sure that the url fetched is not already in the cache. If so, then returns cached file contents without adding to cache.
  2: Fetches from the network and returns the response from the fetched url.
  3: If (2) occurs, uses clone function to add the file to the cache for future use by the user if the connection is lost.
*/
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