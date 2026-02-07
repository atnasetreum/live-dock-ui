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
};

self.handlePush = (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title ?? "Notificación de Live Dock";
  const body = data.body ?? "¡Tienes una nueva notificación!";

  const typeNotification = data.typeNotification ?? "warning";
  const tagId = data.tagId ?? "live-dock-notification";

  const lang = data.lang ?? "es-MX";
  const timestamp = data.timestamp ?? 1 * 1000; // 3 segundos, en milisegundos
  const vibrate = data.vibrate ?? [200, 100, 200, 100, 400];
  const eventTime = data.eventTime;

  const llegaPipa = [200];

  const aprobacionCalidad = [100, 50, 100];

  const rechazoCalidad = [300, 100, 300, 100, 300];

  const vibrateCurrent = vibrate
    ? llegaPipa
    : aprobacionCalidad
      ? rechazoCalidad
      : vibrate;

  const options = {
    body: `${body} \n Fecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    image: IMAGES[typeNotification]?.image,
    //tag: tagId,
    data: {
      link: data.link ?? "http://localhost:3000/dashboard", // Puedes incluir cualquier dato adicional que necesites para manejar la notificación
      visibleAt: Date.now(),
      eventTime,
    },
    //icon: `${ROOT_IMG_FOLDER}/confirm-icon.webp`, //IMAGES[typeNotification]?.icon,
    lang,
    timestamp,
    vibrate: vibrateCurrent,
    //renotify: true, // Si se recibe una nueva notificación con el mismo tag, se mostrará de nuevo y vibrará
    silent: false,
    requireInteraction: true, // La notificación permanecerá visible hasta que el usuario interactúe con ella
    actions: [
      {
        action: "autorizar",
        title: "Autorizar",
        icon: `${ROOT_IMG_FOLDER}/confirm-icon.webp`,
      },
      {
        action: "rechazar",
        title: "Rechazar",
        icon: `${ROOT_IMG_FOLDER}/reject-icon.png`,
      },
    ],
    lang: "es-MX",
    timestamp: new Date(eventTime).getTime(),
  };

  event.waitUntil(self.registration.showNotification(title, options));

  /* event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // cualquier otra tarea asíncrona
    ]),
  ); */
};
