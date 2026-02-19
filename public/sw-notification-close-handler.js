self.handleNotificationClose = (event) => {
  if (self.cancelNotificationExpiration) {
    self.cancelNotificationExpiration(event.notification.tag);
  }

  const metadata = event.notification.data || {};

  console.log({ metadata });

  const accionAt = Date.now();

  const { visibleAt } = metadata;

  const visibleTimeMs = accionAt - visibleAt;
  const visibleTimeSec = Math.floor(visibleTimeMs / 1000);

  console.log({ closeInSec: visibleTimeSec });

  console.log("Notificación cerrada por el usuario ❌", metadata);

  const payloadMetric = {
    /* ...metadata,
    reactionTimeSec: visibleTimeSec,
    accionAt: new Date(accionAt).toISOString(), */
    id: metadata.id,
    notifiedUserId: metadata.notifiedUserId,
    visibleAt,
    actionConfirm: metadata.actionConfirm,
    eventType: "NOTIFICATION_CLOSED",
    publicBackendUrl: metadata.publicBackendUrl,
    appKey: metadata.appKey,
  };

  event.waitUntil(
    self.notifyMetric({
      ...payloadMetric,
      eventType: "NOTIFICATION_CLOSED",
    }),
  );
};
