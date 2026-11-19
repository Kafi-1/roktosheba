// RoktoSeva service worker — network-first so new deployments are picked up immediately,
// with an offline fallback to the last cached copy. Bump VERSION to force a cache reset.
const VERSION = "rs-v4";
const SHELL = ["./", "./index.html", "./css/style.css", "./js/site-config.js", "./js/i18n.js", "./js/common.js",
  "./js/firebase-config.js", "./js/locationData.js", "./assets/favicon.ico", "./assets/roktoseba.jpg", "./assets/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch Firebase / fonts / CDN requests

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
