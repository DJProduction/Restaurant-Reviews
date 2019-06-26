/*
  Service worker is being registered.
  If successful, the functions for service worker can be modified in the root directory.
  Service worker is located in the root directory to ensure that all the content will be in the scope of the service worker.
*/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service_worker.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}