self.handleNotificationClose = (event) => {
  const data = event.notification.data;

  const closedAt = Date.now();

  const { visibleAt } = event.notification.data;

  const visibleTimeMs = closedAt - visibleAt;
  const visibleTimeSec = Math.floor(visibleTimeMs / 1000);

  console.log({ closeInSec: visibleTimeSec });

  console.log("Notificación cerrada por el usuario ❌", data);
};
