/* FireNate service worker — offline app-shell caching for a static,
   no-build-step site. Scoped to whatever directory this script is actually
   registered from (nav.js registers it BASE-relative), not assumed to be a
   real domain root — so these shell paths are resolved against the
   service worker's own URL rather than hardcoded as root-absolute, the
   same fix applied to nav.js's favicon/manifest links and manifest.json's
   own start_url/scope/icon paths. */
const CACHE_NAME = "firenate-v4.7";
const ROOT = new URL("./", self.location).href;
const APP_SHELL = [
  "", "index.html", "manifest.json", "assets/img/favicon.svg",
  "assets/css/site.css", "assets/css/index.css",
  "assets/js/theme-init.js", "assets/js/theme.js", "assets/js/user-profile.js",
  "assets/js/nav.js", "assets/js/profile-autofill.js", "assets/html/footer.html"
].map((p) => ROOT + p);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// network-first for same-origin GET requests, falling back to whatever's
// cached when offline — keeps content fresh while online, and still usable
// without a connection for any page that's been visited at least once
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
