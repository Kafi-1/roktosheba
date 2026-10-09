// RoktoSeva basic service worker — offline shell
const CACHE = "roktoseva-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/common.js",
  "./js/firebase-config.js",
  "./js/locationData.js",
  "./assets/favicon.ico",
  "./assets/roktoseba.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached ||
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          if (res.ok && e.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached || caches.match("./index.html"))
    )
  );
});
