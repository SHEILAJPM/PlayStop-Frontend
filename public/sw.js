const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// En dev: desregistrar para que Vite HMR funcione sin interferencias
if (isLocalhost) {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', () => {
    self.registration.unregister().then(() =>
      self.clients.matchAll({ type: 'window' })
    ).then((clients) => clients.forEach((c) => c.navigate(c.url)));
  });
} else {

const CACHE = 'playstop-v2';
const OFFLINE_URL = '/offline.html';

// Recursos que se precachean al instalar
const PRECACHE = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Nunca cachear llamadas a la API
  if (e.request.url.includes('/api/') || e.request.url.includes('/ws')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: 'Sin conexión. Verifica tu red.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Navegación: network-first, fallback a offline.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Assets: cache-first, luego red
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});

// Notificaciones push
self.addEventListener('push', (e) => {
  if (!e.data) return;
  let data;
  try { data = e.data.json(); } catch { data = { title: 'PlayStop', body: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'PlayStop', {
      body: data.body || '',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: data.tag || 'playstop',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const url = e.notification.data?.url || '/';
      const match = clients.find((c) => c.url === url && 'focus' in c);
      if (match) return match.focus();
      return self.clients.openWindow(url);
    })
  );
});

} // end else (producción)
