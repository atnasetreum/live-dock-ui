const ROOT_IMG_FOLDER = "/push-notifications";

const IMAGES = {
  success: {
    image: `${ROOT_IMG_FOLDER}/image-success.png`,
    icon: `${ROOT_IMG_FOLDER}/icon-success.png`,
  },
  warning: {
    image: `${ROOT_IMG_FOLDER}/image-warning.png`,
  },
  rejected: {
    image: `${ROOT_IMG_FOLDER}/image-rejected.png`,
  },
  waiting: {
    image: `${ROOT_IMG_FOLDER}/image-waiting.png`,
  },
};

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
  const typeNotification = data?.typeNotification ?? "warning";
  const tagId = data?.tagId ?? "live-dock-notification";
  const lang = data?.lang ?? "es-MX";
  const timestamp = data?.timestamp ?? 1 * 1000; // 3 segundos, en milisegundos
  const vibrate = data?.vibrate ?? [];
  const eventTime = data?.eventTime;
  const requireInteraction = data?.requireInteraction ?? true;
  const actions = data?.actions ?? [];
  const metadata = data?.data ?? {};

  /* const aprobacionCalidad = [100, 50, 100];

  const rechazoCalidad = [300, 100, 300, 100, 300];

  const vibrateCurrent = vibrate
    ? llegaPipa
    : aprobacionCalidad
      ? rechazoCalidad
      : vibrate; */

  const visibleAt = Date.now();

  self.cancelNotificationExpiration(tagId);

  const options = {
    body: `${body} \n Fecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    image: IMAGES[typeNotification]?.image,
    tag: tagId,
    data: {
      ...metadata,
      visibleAt,
      eventTime,
    },
    //icon: `${ROOT_IMG_FOLDER}/confirm-icon.webp`, //IMAGES[typeNotification]?.icon,
    lang,
    timestamp,
    vibrate,
    renotify: true, // Si se recibe una nueva notificación con el mismo tag, se mostrará de nuevo y vibrará
    silent: false,
    requireInteraction,
    actions,
    lang: "es-MX",
    timestamp: new Date(eventTime).getTime(),
  };

  const publicBackendUrl = metadata.publicBackendUrl;

  const expirationPromise = new Promise((resolve) => {
    const timerId = setTimeout(() => {
      notificationExpirations.delete(tagId);
      self
        .notifyMetric({
          id: Number(metadata.id),
          publicBackendUrl,
          notifiedUserId: Number(metadata.notifiedUserId),
          visibleAt,
          eventType: "EXPIRED",
        })
        .finally(resolve);
    }, NOTIFICATION_EXPIRE_MS);
    notificationExpirations.set(tagId, { timerId, resolve });
  });

  console.log({ options });

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.notifyMetric({
        id: Number(metadata.id),
        publicBackendUrl,
        notifiedUserId: Number(metadata.notifiedUserId),
        visibleAt,
        eventType: "NOTIFICATION_SHOWN",
      }),
      expirationPromise,
    ]),
  );
};
