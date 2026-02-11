self.handleNotificationClick = (event) => {
  //event.notification.close();

  if (self.cancelNotificationExpiration) {
    self.cancelNotificationExpiration(event.notification.tag);
  }

  const action = event.action;

  const metadata = event.notification.data || {};

  const { id, notifiedUserId, visibleAt, eventTime } = metadata;

  const accionAt = Date.now();

  //Tiempo reacción = acciónAt - visibleAt
  const visibleTimeMs = accionAt - visibleAt;
  const reactionTimeSec = Math.floor(visibleTimeMs / 1000);

  //Tiempo atraso = visibleAt - eventAt
  const eventAt = new Date(eventTime).getTime();
  const atrasoTimeMs = visibleAt - eventAt;
  const systemDelaySec = Math.floor(atrasoTimeMs / 1000);

  const totalTimeSec = reactionTimeSec + systemDelaySec;

  console.log({
    id,
    reactionTimeSec,
    systemDelaySec,
    totalTimeSec,
  });

  const url = `${metadata.publicBackendUrl}/reception-process/notify-metric`;

  function notifyMetric(eventType) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        reactionTimeSec,
        accionAt: new Date(accionAt).toISOString(),
        systemDelaySec,
        notifiedUserId,
        visibleAt,
        eventTime,
        eventType,
        timestamp: new Date().toISOString(),
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isOnline: navigator.onLine,
          deviceMemory: navigator.deviceMemory || "unknown",
          connection: navigator.connection?.effectiveType || "unknown",
        },
      }),
    });
  }

  switch (action) {
    case "confirm-logistic":
      event.waitUntil(
        Promise.all([
          (async () => {
            const allClients = await clients.matchAll({
              type: "window",
              includeUncontrolled: true,
            });

            // URL destino
            const targetUrl = `/dashboard`;

            // 1️⃣ Buscar si ya está abierta
            for (const client of allClients) {
              if (client.url.includes(targetUrl)) {
                // traer al frente
                await client.focus();

                // mandar datos a la app
                client.postMessage({
                  type: "confirm-logistic-clicked",
                  data: event.notification.data,
                });

                return;
              }
            }
            // 2️⃣ Si no existe, abrir nueva
            await clients.openWindow(targetUrl);
          })(),
          notifyMetric("ACTION_CLICKED_CONFIRM"),
        ]),
      );
      break;
    case "rechazar":
      // Lógica para manejar la acción de rechazar
      console.log("Usuario rechazó la acción");
      // Aquí puedes realizar cualquier acción adicional, como abrir una URL o enviar un mensaje al cliente
      break;
    default:
      // Lógica para manejar el clic en la notificación sin seleccionar una acción específica
      console.log("Usuario hizo clic en la notificación");
      // Aquí puedes realizar cualquier acción adicional, como abrir una URL o enviar un mensaje al cliente
      event.waitUntil(notifyMetric("NOTIFICATION_CLICKED_NOT_ACTION"));
      break;
  }

  // Si deseas abrir una URL específica al hacer clic en la notificación, puedes usar clients.openWindow()
  // Por ejemplo:
  // event.waitUntil(clients.openWindow('https://www.ejemplo.com'));
};
