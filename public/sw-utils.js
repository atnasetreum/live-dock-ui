self.getClientInfo = async () => {
  if (!navigator.userAgentData) {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  }

  try {
    const { brands, platform, mobile } = navigator.userAgentData;

    const highEntropy = await navigator.userAgentData.getHighEntropyValues([
      "platformVersion", // Versión del SO
      "architecture", // Arquitectura (x86, arm64, etc)
      "model", // Modelo del dispositivo
      "uaFullVersion", // Versión completa del navegador
      "fullVersionList", // Lista completa de versiones
      "bitness", // 32 o 64 bits
    ]);

    return {
      userAgent: navigator.userAgent, // Cadena completa del user agent
      browserVersion: highEntropy.uaFullVersion, // Versión completa del navegador
      brands, // Marca y versión del navegador (ej: Chrome 114)
      platform, // Plataforma (ej: Windows, macOS, Android)
      mobile, // Es un dispositivo móvil o no
      platformVersion: highEntropy.platformVersion, // Versión del sistema operativo
      architecture: highEntropy.architecture, // Arquitectura del dispositivo
      model: highEntropy.model, // Modelo del dispositivo (si está disponible)
      bitness: highEntropy.bitness, // 32 o 64 bits
      deviceMemory: navigator.deviceMemory || "unknown", // RAM disponible
      language: navigator.language || "unknown", // Idioma
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown", // Zona horaria
      deviceMemory: navigator.deviceMemory || "unknown", // RAM disponible
      connection: navigator.connection?.effectiveType || "unknown", // Tipo de conexión (4g, 3g, etc)
    };
  } catch (error) {
    console.warn("userAgentData unavailable", error);
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  }
};

self.notifyMetric = async ({
  publicBackendUrl,
  appKey,
  eventType,
  ...payload
}) => {
  const url = `${publicBackendUrl}/reception-process/notify-metric`;

  const clientInfo = await self.getClientInfo();

  if (eventType === "NOTIFICATION_CLOSED" && !clientInfo.mobile) {
    return; // No enviar métricas de cierre para desktop
  }

  delete payload.eventTime;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-key": appKey,
    },
    body: JSON.stringify({
      ...payload,
      eventType,
      metadata: JSON.stringify(clientInfo),
    }),
  });
};
