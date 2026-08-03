// sw.js — Service Worker "network-first"
// Siempre intenta traer la última versión desde internet.
// Si no hay conexión, usa la copia guardada (para que la app abra igual sin internet).
const CACHE = 'torneo-padel-20260702';

self.addEventListener('install', (e) => {
  // Activa la versión nueva enseguida, sin esperar.
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Borra cachés viejos de versiones anteriores.
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // solo lecturas
  e.respondWith((async () => {
    try {
      // 1) Primero la red (versión más nueva)
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone()).catch(() => {});
      return fresh;
    } catch (err) {
      // 2) Sin internet: usa la copia guardada
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
