self.handleNotificationClose = (event) => {
  if (self.cancelNotificationExpiration) {
    self.cancelNotificationExpiration(event.notification.tag);
  }

  const metadata = event.notification.data || {};

  const closedAt = Date.now();

  const { visibleAt } = metadata;

  const visibleTimeMs = closedAt - visibleAt;
  const visibleTimeSec = Math.floor(visibleTimeMs / 1000);

  console.log({ closeInSec: visibleTimeSec });

  console.log("Notificación cerrada por el usuario ❌", metadata);

  const payloadMetric = {
    ...metadata,
    reactionTimeSec: visibleTimeSec,
    accionAt: new Date(accionAt).toISOString(),
  };

  event.waitUntil(
    self.notifyMetric({
      ...payloadMetric,
      eventType: "NOTIFICATION_CLOSED",
    }),
  );
};
