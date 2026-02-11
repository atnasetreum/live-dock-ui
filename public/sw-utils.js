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
      "platformVersion",
      "architecture",
      "model",
      "uaFullVersion",
      "fullVersionList",
      "bitness",
    ]);

    return {
      brands,
      platform,
      mobile,
      platformVersion: highEntropy.platformVersion,
      architecture: highEntropy.architecture,
      model: highEntropy.model,
      uaFullVersion: highEntropy.uaFullVersion,
      fullVersionList: highEntropy.fullVersionList,
      bitness: highEntropy.bitness,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isOnline: navigator.onLine,
      deviceMemory: navigator.deviceMemory || "unknown",
      connection: navigator.connection?.effectiveType || "unknown",
    };
  } catch (error) {
    console.warn("userAgentData unavailable", error);
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  }
};

self.notifyMetric = async ({ publicBackendUrl, appKey, ...payload }) => {
  const url = `${publicBackendUrl}/reception-process/notify-metric`;

  const clientInfo = await self.getClientInfo();

  const payloadMetadata =
    payload &&
    payload.metadata &&
    typeof payload.metadata === "object" &&
    !Array.isArray(payload.metadata)
      ? payload.metadata
      : null;
  const metadata = payloadMetadata
    ? { ...payloadMetadata, clientInfo }
    : clientInfo;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-key": appKey,
    },
    body: JSON.stringify({
      ...payload,
      metadata: JSON.stringify(metadata),
    }),
  });
};
