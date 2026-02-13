const ROOT_IMG_FOLDER = "/push-notifications";

const NOTIFICATION_EXPIRE_MS = 10 * 1000; // 10 segundos para pruebas, luego se puede ajustar a un tiempo más largo como 5 minutos (5 * 60 * 1000)

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
  const timestamp = data?.timestamp ?? 1 * 1000; // 3 segundos, en milisegundos
  const actions = data?.actions ?? [];
  const metadata = data?.data ?? {};
  const visibleAt = Date.now();
  const image = data?.image ? `${ROOT_IMG_FOLDER}/${data.image}` : undefined;

  const { eventTime } = metadata;

  self.cancelNotificationExpiration(tagId);

  const notificationOptions = {
    body: `${body}\nFecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    image,
    tag: tagId,
    data: {
      ...metadata,
      visibleAt,
    },
    lang,
    timestamp,
    vibrate: [100, 50, 100],
    renotify: true, // Si se recibe una nueva notificación con el mismo tag, se mostrará de nuevo y vibrará
    requireInteraction: true, // La notificación permanecerá visible hasta que el usuario interactúe con ella
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
  };

  // Cuando el usuario no interactúa con la notificación, se considera que ha expirado
  const expirationPromise = new Promise((resolve) => {
    if (requireInteraction) {
      const timerId = setTimeout(() => {
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
