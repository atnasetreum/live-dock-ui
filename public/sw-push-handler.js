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
  const requireInteraction = data?.requireInteraction ?? true;
  const actions = data?.actions ?? [];
  const metadata = data?.data ?? {};
  const visibleAt = Date.now();
  const image = data?.image ? `${ROOT_IMG_FOLDER}/${data.image}` : undefined;

  const { eventTime } = metadata;

  self.cancelNotificationExpiration(tagId);

  const options = {
    body: `${body} \n Fecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    image,
    tag: tagId,
    data: {
      ...metadata,
      visibleAt,
    },
    //icon: `${ROOT_IMG_FOLDER}/confirm-icon.webp`, //IMAGES[typeNotification]?.icon,
    lang,
    timestamp,
    vibrate: [100, 50, 100],
    renotify: true, // Si se recibe una nueva notificación con el mismo tag, se mostrará de nuevo y vibrará
    silent: false,
    requireInteraction,
    actions,
    lang: "es-MX",
    timestamp: new Date(eventTime).getTime(),
  };

  const payloadDefault = {
    id: Number(metadata.id),
    publicBackendUrl: metadata.publicBackendUrl,
    notifiedUserId: Number(metadata.notifiedUserId),
    appKey: metadata.appKey,
    visibleAt,
  };

  const expirationPromise = new Promise((resolve) => {
    const timerId = setTimeout(() => {
      notificationExpirations.delete(tagId);
      self
        .notifyMetric({
          ...payloadDefault,
          eventType: "EXPIRED",
        })
        .finally(resolve);
    }, NOTIFICATION_EXPIRE_MS);
    notificationExpirations.set(tagId, { timerId, resolve });
  });

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.notifyMetric({
        ...payloadDefault,
        eventType: "NOTIFICATION_SHOWN",
      }),
      expirationPromise,
    ]),
  );
};
