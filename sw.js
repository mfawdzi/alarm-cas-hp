/*
 * sw.js
 * Service worker: menyimpan file aplikasi supaya bisa dibuka tanpa internet.
 * Hanya aktif jika aplikasi dibuka lewat HTTPS atau localhost.
 */
var CACHE = "alarm-cas-hp-v3";
var FILES = [
  "./",
  "index.html",
  "manifest.json",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "js/gates.js",
  "js/battery.js",
  "js/alarm-sound.js",
  "js/wakelock.js",
  "js/settings.js",
  "js/theme.js",
  "js/ui-home.js",
  "js/ui-settings.js",
  "js/ui-overlay.js",
  "js/navigation.js",
  "js/app.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") { return; }
  event.respondWith(
    fetch(event.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(event.request, copy); });
      return res;
    }).catch(function () { return caches.match(event.request); })
  );
});
