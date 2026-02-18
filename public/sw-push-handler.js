const ROOT_IMG_FOLDER = "/push-notifications";

const NOTIFICATION_EXPIRE_MS = 2 * 60 * 1000; // 10 segundos para pruebas, luego se puede ajustar a un tiempo más largo como 2 minutos (2 * 60 * 1000)

const notificationExpirations = new Map();

self.cancelNotificationExpiration = (notificationTag) => {
  const entry = notificationExpirations.get(notificationTag);

  if (!entry) {
    return;
  }

  clearTimeout(entry.timerId);
  entry.resolve();
  notificationExpirations.delete(notificationTag);
};

self.handlePush = (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data?.title ?? "Notificación de Live Dock";
  const body = data?.body ?? "¡Tienes una nueva notificación!";
  const tagId = data?.tagId ?? "live-dock-notification";
  const lang = data?.lang ?? "es-MX";
  const timestamp = data?.timestamp ?? 1 * 1000;
  const actions = data?.actions ?? [];
  const metadata = data?.data ?? {};
  const visibleAt = Date.now();
  const image = data?.image ? `${ROOT_IMG_FOLDER}/${data.image}` : undefined;
  const requireInteraction = data?.requireInteraction === true;

  const { eventTime, actionConfirm } = metadata;

  self.cancelNotificationExpiration(tagId);

  const notificationOptions = {
    body: `${body}\nFecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    image,
    tag: tagId,
    data: {
      ...metadata,
      actions,
      visibleAt,
    },
    lang,
    timestamp,
    vibrate: [100, 50, 100],
    renotify: true, // Si se recibe una nueva notificación con el mismo tag, se mostrará de nuevo y vibrará
    requireInteraction, // La notificación permanecerá visible hasta que el usuario interactúe con ella
    silent: false,
    actions,
    lang: "es-MX",
    timestamp: new Date(eventTime).getTime(),
  };

  const payloadMetric = {
    id: Number(metadata.id),
    appKey: metadata.appKey,
    publicBackendUrl: metadata.publicBackendUrl,
    notifiedUserId: Number(metadata.notifiedUserId),
    visibleAt,
    actionConfirm: actionConfirm || "no-action",
  };

  // Cuando el usuario no interactúa con la notificación, se considera que ha expirado
  const expirationPromise = new Promise((resolve) => {
    if (requireInteraction) {
      const timerId = setTimeout(() => {
        console.log("[EXPIRED] Vuelve a notificar al usuario");

        notificationExpirations.delete(tagId);
        self
          .notifyMetric({
            ...payloadMetric,
            eventType: "EXPIRED",
          })
          .finally(resolve);
      }, NOTIFICATION_EXPIRE_MS);
      notificationExpirations.set(tagId, { timerId, resolve });
    } else {
      resolve();
    }
  });

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, notificationOptions),
      // Cuando se muestra la notificación, se registra el evento de "NOTIFICATION_SHOWN"
      self.notifyMetric({
        ...payloadMetric,
        eventType: "NOTIFICATION_SHOWN",
      }),
      expirationPromise,
    ]),
  );
};
