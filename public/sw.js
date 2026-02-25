importScripts("/sw-utils.js");
importScripts("/sw-push-handler.js");
importScripts("/sw-notification-click-handler.js");
importScripts("/sw-notification-close-handler.js");

self.addEventListener("install", () => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activado");
  //event.waitUntil(self.clients.claim());
  event.waitUntil(
    (async () => {
      // Reclama todas las páginas abiertas
      await self.clients.claim();

      // Avisar a todas las páginas que ya están bajo control del nuevo SW
      const clientsList = await self.clients.matchAll({
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        client.postMessage({
          type: "NEW_VERSION",
          message: "Nueva versión instalada y activada correctamente.",
        });
      }
    })(),
  );
});

self.addEventListener("push", self.handlePush);

self.addEventListener("notificationclick", self.handleNotificationClick);

self.addEventListener("notificationclose", self.handleNotificationClose);
