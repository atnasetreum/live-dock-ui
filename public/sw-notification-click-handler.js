self.handleNotificationClick = (event) => {
  event.notification.close();

  const accionAt = Date.now();

  const action = event.action;

  const metadata = event.notification.data || {};

  const { visibleAt, eventTime } = metadata;

  //Tiempo reacción = acciónAt - visibleAt
  const visibleTimeMs = accionAt - visibleAt;
  const reactionTimeSec = Math.floor(visibleTimeMs / 1000);

  //Tiempo atraso = visibleAt - eventAt
  const eventAt = new Date(eventTime).getTime();
  const delayTimeMs = visibleAt - eventAt;
  const systemDelaySec = Math.floor(delayTimeMs / 1000);

  //const totalTimeSec = reactionTimeSec + systemDelaySec;

  const actions = [...metadata.actions];

  delete metadata.actions;

  const payloadMetric = {
    ...metadata,
    reactionTimeSec,
    accionAt: new Date(accionAt).toISOString(),
    systemDelaySec,
  };

  async function handleConfirmAction() {
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
          type: "confirm-clicked",
          data: payloadMetric,
        });

        return;
      }
    }
    // 2️⃣ Si no existe, abrir nueva
    await clients.openWindow(targetUrl);
  }

  if (actions.length) {
    switch (action) {
      case "confirm":
        console.log("Usuario confirmo la acción");
        event.waitUntil(
          Promise.all([
            handleConfirmAction(),
            self.notifyMetric({
              ...payloadMetric,
              eventType: "ACTION_CLICKED_CONFIRM",
            }),
          ]),
        );
        break;
      default:
        console.log("Usuario hizo clic en la notificación");
        event.waitUntil(
          self.notifyMetric({
            ...payloadMetric,
            eventType: "NOTIFICATION_CLICKED_NOT_ACTION",
          }),
        );
        break;
    }
  }
};
