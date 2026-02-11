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

  const url = `${metadata.publicBackendUrl}/reception-process/notify-metric`;

  function notifyMetric(eventType) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Number(metadata.id),
        notifiedUserId: Number(metadata.notifiedUserId),
        visibleAt,
        eventType,
      }),
    });
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      notifyMetric("NOTIFICATION_SHOWN"),
    ]),
  );
};
