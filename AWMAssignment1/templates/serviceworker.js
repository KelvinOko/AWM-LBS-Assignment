var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/offline',
    '/static/css/django-pwa-app.css',
    '/static/images/location.png'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});


////////////////////////////////////////////////////////////////////////////////////
// console.log('Hello from service worker');
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
//
// // This will listen for messages of type: 'SKIP_WAITING' and run the skipWaiting() method, forcing the service worker to
// // activate right away.
// self.addEventListener('message', (event) => {
//     if (event.data && event.data.type === 'SKIP_WAITING') {
//         console.log("Invoked skipWaiting");
//         self.skipWaiting();
//     }
// });
//
// // Check if workbox loaded
// if (workbox) {
//     console.log("Workbox is loaded.");
// } else {
//     console.log("Workbox didn't load");
// }
//
// // workbox.setConfig({debug: true});
//
// // This will trigger the importScripts() for workbox.strategies, routing etc and their dependencies:
// const {strategies} = workbox;
// const {routing} = workbox;
// const {precaching} = workbox;
// const {core} = workbox;
// const cacheable_response = workbox.cacheableResponse;
// const expiration = workbox.expiration;
// // const {navigtaionPreload} = workbox;
//
// // Set default cache names
// core.setCacheNameDetails({
//     prefix: 'awm2021',
//     suffix: 'v1',
//     precache: 'precache',
//     runtime: 'runtime',
//     googleAnalytics: 'analytics'
// });