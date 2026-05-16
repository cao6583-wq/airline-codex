// LinkNest Service Worker — auto-versioned
const BUILD_ID = '202605161944';
const CACHE_NAME = 'linknest-' + BUILD_ID;
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './linknest-white-favicon.png',
  './linknest-white-icon-192.png',
  './linknest-white-icon-512.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js'
];

// Install: pre-cache the local shell, then skip waiting so the new SW activates immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

// Activate: claim clients + delete ALL old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: NETWORK-FIRST for everything (always get latest)
// Falls back to cache only if offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Don't intercept non-GET or different origin requests we don't control
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses for offline fallback
        if (response.ok && (url.hostname === self.location.hostname ||
            url.hostname === 'unpkg.com' ||
            url.hostname === 'cdn.jsdelivr.net' ||
            url.hostname === 'fonts.googleapis.com' ||
            url.hostname === 'fonts.gstatic.com')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request)
          .then(cached => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'LinkNest';
  const options = {
    body: data.body || '你有一条新的借阅消息',
    icon: './linknest-white-icon-192.png',
    badge: './linknest-white-icon-192.png',
    data: { url: data.url || './' },
    tag: data.tag || 'airlink-update'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : './';
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
