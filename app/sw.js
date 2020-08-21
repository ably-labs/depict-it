var cacheName = 'depict-it';

var filesToCache = [
    '/offline.html',
    '/style.css',
    "/manifest.json",
    '/assets/logo.svg',
    '/assets/ably.svg',
    "/assets/icons/favicon.ico",
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');

    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (navigator.onLine) {
        return;
    }

    event.respondWith((async () => {
        const response = await caches.match(event.request, { ignoreSearch: true });
        if (response) {
            return response;
        }

        const cache = await caches.open(cacheName);
        return await cache.match("/offline.html");

    })());
});