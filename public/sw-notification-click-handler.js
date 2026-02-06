self.handleNotificationClick = (event) => {
  //event.notification.close();

  const action = event.action;

  const payload = event.notification.data || {};

  console.log({ data: event.data, payload });

  const { link, visibleAt, eventTime } = payload;

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
    link,
    tiempoReaccionUsuario,
    tiempoAtrasoBackend,
    tiempoTotal,
  });

  if (action === "autorizar") {
    // Lógica para manejar la acción de autorizar
    console.log("Usuario autorizó la acción");
    // Aquí puedes realizar cualquier acción adicional, como abrir una URL o enviar un mensaje al cliente
    event.waitUntil(
      (async () => {
        const allClients = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        // URL destino
        //const targetUrl = `/dashboard?pipa=${event.notification.data.pipaId}`;

        // 1️⃣ Buscar si ya está abierta
        for (const client of allClients) {
          if (client.url.includes("/dashboard")) {
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
        await clients.openWindow(link);
      })(),
    );
  } else if (action === "rechazar") {
    // Lógica para manejar la acción de rechazar
    console.log("Usuario rechazó la acción");
    // Aquí puedes realizar cualquier acción adicional, como abrir una URL o enviar un mensaje al cliente
  } else {
    // Lógica para manejar el clic en la notificación sin seleccionar una acción específica
    console.log("Usuario hizo clic en la notificación");
    // Aquí puedes realizar cualquier acción adicional, como abrir una URL o enviar un mensaje al cliente
  }

  // Si deseas abrir una URL específica al hacer clic en la notificación, puedes usar clients.openWindow()
  // Por ejemplo:
  // event.waitUntil(clients.openWindow('https://www.ejemplo.com'));
};
