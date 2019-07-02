const CACHE_NAME = 'restuarant-cache-v1';
/*
  1. Team member can uncomment and give the user the entire site cache if needed on first loaded.
*/
//let urlsToCache = [
// '/',
// '/css',
// '/data',
// '/img',
// '/js',
// '/sw'
//];
/*
  2. Team member can give the user an empty cache that gets filled  with necessary files as the user navigates the site.
*/
let urlsToCache = [];

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
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/*
  1: Attempts to fetch from the network and returns the response from the fetched url.
  2: If (1) is successful, uses clone function to add the file to the cache for future use by the user if the connection is lost.
  3: If (1) fails, logs the error and attempts to match the requested url to the urls in the cache to try and return necessary information for the response.
*/
self.addEventListener('fetch', (event) => {
  console.log(`Service Worker: Fetch`);
  event.respondWith(
    fetch(event.request).then((response) => {
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
    }).catch((error) => {
      // This means fetch as failed and there is a connection error or interuption
      console.log(error.message);
      console.log(error);
      // Check if there is a matched response in the cache
      caches.match(event.response).then(response => {
        return response;
      })
    })
  );
});