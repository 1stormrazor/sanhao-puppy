const CACHE_NAME = "sanhao-puppy-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./src/app.js",
  "./assets/dog/samoyed-logo.png",
  "./assets/dog/samoyed-main.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/items/ball.svg",
  "./assets/items/bath.svg",
  "./assets/items/bone.svg",
  "./assets/items/comb.svg",
  "./assets/items/dog-bed.svg",
  "./assets/items/dog-food.svg",
  "./assets/items/feeder.svg",
  "./assets/items/hat.svg",
  "./assets/items/shampoo.svg",
  "./assets/items/teddy.svg",
  "./assets/tasks/breakfast.svg",
  "./assets/tasks/read.svg",
  "./assets/tasks/sleep.svg",
  "./assets/tasks/sport.svg",
  "./assets/tasks/study.svg",
  "./assets/tasks/wakeup.svg",
  "./assets/tasks/walk.svg",
  "./assets/tasks/wash.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
