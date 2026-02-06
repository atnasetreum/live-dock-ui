importScripts("/sw-push-handler.js");

self.addEventListener("install", () => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activado");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", self.handlePush);
