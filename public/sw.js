// Railway Elf service worker.
//
// Strategy:
//   * Same-origin hashed assets under /assets/  → cache-first (immutable filenames)
//   * Same-origin navigations (HTML)           → network-first, fall back to cached shell
//   * Other same-origin static files           → stale-while-revalidate
//   * Cross-origin (OSM tiles, Nominatim, …)   → bypass; let the browser handle it
//
// Bump VERSION when the cache shape changes (e.g. new shell entries) so old
// caches get cleaned up on activate. Hashed bundle filenames already
// invalidate themselves, so most deploys do NOT require a version bump.

const VERSION = "v1";
const PRECACHE = `railway-elf-precache-${VERSION}`;
const RUNTIME = `railway-elf-runtime-${VERSION}`;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./apple-touch-icon.png",
];

const HASHED_ASSET_RE = /\/assets\/.+-[A-Za-z0-9_-]{6,}\.(?:js|css|png|jpe?g|svg|webp|woff2?)$/;

self.addEventListener("install", (event) => {
  // Pre-cache only. Do NOT skipWaiting unconditionally — we want updates to
  // wait for explicit user opt-in via the in-app "新版已可用" notice. The
  // page posts {type: "SKIP_WAITING"} when the user clicks reload.
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await cache.addAll(SHELL);
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k !== PRECACHE && k !== RUNTIME)
        .map((k) => caches.delete(k)),
    );
    // clients.claim takes effect on first install (no prior SW). On updates,
    // the page is already controlled, so claim is a no-op there. The page
    // listens for controllerchange and reloads only when it triggered the
    // skipWaiting itself, so first-install claim does not cause a reload.
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (HASHED_ASSET_RE.test(url.pathname)) {
    event.respondWith(cacheFirst(req, RUNTIME));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirstNav(req));
    return;
  }

  event.respondWith(staleWhileRevalidate(req, PRECACHE));
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirstNav(req) {
  const cache = await caches.open(PRECACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (await cache.match("./index.html")) || (await cache.match("./"));
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);
  return hit || (await network) || fetch(req);
}
