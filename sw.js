/* sw.js — offline reading for Futuro Fortissimo.
   Pages: network-first (always fresh), cached copy when offline → every page you visited stays readable.
   Assets (css/js/json/icons/fonts/images): stale-while-revalidate. Old caches are dropped on activate. */
const VERSION = 'ff-v4';
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const PRECACHE = ['/assets/ff-app.css?v=4', '/assets/ff-app.js?v=4', '/assets/ff-fonts.css?v=4', '/assets/ff-tw.css?v=3', '/assets/fonts/bricolage.woff2', '/assets/fonts/newsreader.woff2', '/assets/fonts/plexmono-700.woff2', '/assets/ff-archive.css', '/assets/icons/icon-192.png', '/manifest.webmanifest'];
const MAX_PAGES = 120;
const MAX_ASSETS = 300;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(ASSETS).then((c) => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trim(name, max) {
  const c = await caches.open(name); const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isPage && url.origin === location.origin) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, MAX_PAGES)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('/404.html') || new Response('Offline', { status: 503 }))));
    return;
  }
  const cacheable = url.origin === location.origin ? /\.(css|js|json|png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname)
    : /(fonts\.(googleapis|gstatic)\.com|substackcdn\.com|cdn\.tailwindcss\.com|esm\.sh|unpkg\.com|cdn\.jsdelivr\.net)$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(caches.open(ASSETS).then((c) => c.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') { c.put(req, res.clone()); trim(ASSETS, MAX_ASSETS); } return res; }).catch(() => hit);
    return hit || net;
  })));
});
