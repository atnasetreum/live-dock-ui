const ROOT_IMG_FOLDER = "/push-notifications";

self.handlePush = (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data?.title ?? "Notificación de prueba";
  const body = data?.body ?? "¡Tienes una nueva notificación!";
  const tagId = data?.tagId ?? "live-dock-notification";
  const lang = data?.lang ?? "es-MX";
  const timestamp = data?.timestamp ?? 1 * 1000;
  const actions = data?.actions ?? [];
  const metadata = data?.data ?? {};
  const visibleAt = Date.now();
  const image = data?.image ? `${ROOT_IMG_FOLDER}/${data.image}` : undefined;
  const requireInteraction = data?.requireInteraction === true;

  const { isTest, eventTime, actionConfirm } = metadata;

  const notificationOptions = {
    body: `${body}\nFecha del evento: ${new Date(eventTime).toLocaleString("es-MX")}`,
    //icon: `/icon-pwa.png`,
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

  if (isTest) {
    console.log("[TEST MODE] Payload de la notificación");
    event.waitUntil(
      self.registration.showNotification(title, notificationOptions),
    );
    return;
  }

  const payloadMetric = {
    id: Number(metadata.id),
    appKey: metadata.appKey,
    publicBackendUrl: metadata.publicBackendUrl,
    notifiedUserId: Number(metadata.notifiedUserId),
    visibleAt,
    actionConfirm: actionConfirm || "no-action",
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, notificationOptions),
      // Cuando se muestra la notificación, se registra el evento de "NOTIFICATION_SHOWN"
      self.notifyMetric({
        ...payloadMetric,
        eventType: "NOTIFICATION_SHOWN",
      }),
    ]),
  );
};
