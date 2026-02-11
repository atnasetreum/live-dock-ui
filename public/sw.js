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
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", self.handlePush);

self.addEventListener("notificationclick", self.handleNotificationClick);

self.addEventListener("notificationclose", self.handleNotificationClose);
