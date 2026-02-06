// Service Worker simple - Solo instalación y activación

self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activado");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("[SW] Push recibido:", event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || "Notificación de Live Dock";
  const options = {
    // body: data.body || "Tienes una nueva notificación",
    body: "Tu pedido #123 está en camino",
    icon: "/push-notifications/icon.svg",
    badge: "/push-notifications/badge.png",
    image: "/push-notifications/badge.png",
    tag: "pedido-123",
    data: { pedidoId: 123 },
    requireInteraction: true,
    actions: [
      { action: "ver", title: "Ver pedido" },
      { action: "cancelar", title: "Cancelar" },
    ],
    lang: "es-ES",
    //dir: "rtl",
    dir: "ltr",
    silent: false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification("🚛 Pipa en recepción", {
      body: "Materia: Ácido X\nAndén: 3\nAcción: Autorizar descarga",
      icon: "/push-notifications/icon.png",
      image: "/push-notifications/badge.png",
      tag: "pipa-anden-3",
      requireInteraction: true,
      data: {
        pipaId: "TX-3491",
        anden: 3,
        materia: "Ácido X",
      },
      actions: [
        { action: "autorizar", title: "Autorizar" },
        { action: "ver", title: "Ver detalle" },
      ],
    }),
  );
});

//tag igual + renotify: true
//→ reemplaza la notificación anterior y vuelve a alertar

//tag igual + renotify: false (default)
//→ reemplaza la notificación anterior sin sonido ni vibración
