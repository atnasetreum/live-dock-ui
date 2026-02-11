self.handleNotificationClick = (event) => {
  //event.notification.close();

  const action = event.action;

  const payload = event.notification.data || {};

  const { id, visibleAt, eventTime } = payload;

  const accionAt = Date.now();

  //Tiempo reacción = acciónAt - visibleAt
  const visibleTimeMs = accionAt - visibleAt;
  const tiempoReaccionUsuario = Math.floor(visibleTimeMs / 1000);

  //Tiempo atraso = visibleAt - eventAt
  const eventAt = new Date(eventTime).getTime();
  const atrasoTimeMs = visibleAt - eventAt;
  const tiempoAtrasoBackend = Math.floor(atrasoTimeMs / 1000);

  const tiempoTotal = tiempoReaccionUsuario + tiempoAtrasoBackend;

  console.log({
    id,
    tiempoReaccionUsuario,
    tiempoAtrasoBackend,
    tiempoTotal,
  });

  switch (action) {
    case "confirm-logistic":
      const payloadMetric = {
        id: Number(metadata.id),
        notifiedUserId: Number(metadata.notifiedUserId),
        visibleAt,
        eventType: "PUSH_RECEIVED",
      };

      const url = `${metadata.publicBackendUrl}/reception-process/notify-metric`;

      function notifyMetric() {
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadMetric),
        });
      }
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
                  type: "PIPA_NOTIFICATION",
                  data: event.notification.data,
                });

                return;
              }
            }
            // 2️⃣ Si no existe, abrir nueva
            await clients.openWindow(targetUrl);
          })(),
          notifyMetric(),
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
      break;
  }

  // Si deseas abrir una URL específica al hacer clic en la notificación, puedes usar clients.openWindow()
  // Por ejemplo:
  // event.waitUntil(clients.openWindow('https://www.ejemplo.com'));
};
