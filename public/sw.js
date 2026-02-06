// Service Worker simple - Solo instalación y activación

self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activado");
  event.waitUntil(self.clients.claim());
});
