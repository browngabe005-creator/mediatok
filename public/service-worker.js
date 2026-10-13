const CACHE_NAME = 'mediatok-v95-layout-settings-2';
const SHELL = ['/lists-v93.css', '/site-skins-v93.css', '/site-layouts-v94.css', '/site-layouts-v94.js', '/passport-v95.js', '/passport-v95.css', '/lists-v93.js', '/site-skins-v93.js', '/mobile-v60.css', '/', '/manifest.webmanifest', '/mt-logo.png', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME && (key.startsWith('mediatok-v') || key.startsWith('mediatok-shell-'))).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put('/', response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('/')) || Response.error()));
    return;
  }
  if (['/manifest.webmanifest','/mt-logo.png','/icons/icon-192.png','/icons/icon-512.png'].includes(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    })));
  }
});
