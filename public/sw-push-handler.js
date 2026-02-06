self.handlePush = (event) => {
  const data = event.data ? event.data.json() : {};
  console.log({ data });
  const title = data.title ?? "Notificación de Live Dock";
  const options = {
    /* ...armas tu payload... */
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // cualquier otra tarea asíncrona
    ]),
  );
};
