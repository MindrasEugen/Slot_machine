// Task 1 — Service Worker minimo (installabilità PWA, online-first).
// Task 26: cache aggiornata (icone PWA + supabase-sync).
const CACHE = 'egitto-slot-task26-v1';
const CORE = ['./', './index.html', './css/style.css', './js/app.js', './js/audio.js', './js/config.js', './js/engine.js', './js/symbols.js', './js/game.js', './js/supabase-sync.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
