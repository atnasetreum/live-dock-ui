self.handleNotificationClose = (event) => {
  if (self.cancelNotificationExpiration) {
    self.cancelNotificationExpiration(event.notification.tag);
  }

  const metadata = event.notification.data || {};

  const accionAt = Date.now();

  const { visibleAt, eventTime } = metadata;

  //Tiempo reacción = acciónAt - visibleAt
  const visibleTimeMs = accionAt - visibleAt;
  const reactionTimeSec = Math.floor(visibleTimeMs / 1000);

  //Tiempo atraso = visibleAt - eventAt
  const eventAt = new Date(eventTime).getTime();
  const delayTimeMs = visibleAt - eventAt;
  const systemDelaySec = Math.floor(delayTimeMs / 1000);

  console.log("Notificación cerrada por el usuario ❌", metadata);

  const payloadMetric = {
    id: metadata.id,
    reactionTimeSec,
    systemDelaySec,
    notifiedUserId: metadata.notifiedUserId,
    visibleAt,
    accionAt: new Date(accionAt).toISOString(),
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
