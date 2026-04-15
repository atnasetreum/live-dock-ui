type UserAgentBrand = {
  brand: string;
  version: string;
};

type UserAgentData = {
  brands: UserAgentBrand[];
  platform: string;
  mobile: boolean;
  getHighEntropyValues: (hints: string[]) => Promise<{
    platformVersion?: string;
    architecture?: string;
    model?: string;
    uaFullVersion?: string;
    fullVersionList?: UserAgentBrand[];
    bitness?: string;
  }>;
};

type NavigatorClientInfo = Navigator & {
  userAgentData?: UserAgentData;
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
  };
};

export const getClientInfo = async () => {
  const nav = navigator as NavigatorClientInfo;

  if (!nav.userAgentData) {
    return {
      userAgent: nav.userAgent,
      platform: nav.platform,
    };
  }

  try {
    const { brands, platform, mobile } = nav.userAgentData;

    const highEntropy = await nav.userAgentData.getHighEntropyValues([
      "platformVersion", // Versión del SO
      "architecture", // Arquitectura (x86, arm64, etc)
      "model", // Modelo del dispositivo
      "uaFullVersion", // Versión completa del navegador
      "fullVersionList", // Lista completa de versiones
      "bitness", // 32 o 64 bits
    ]);

    // 👇 AQUÍ está la respuesta real
    const fullVersionList = highEntropy.fullVersionList;

    // Buscar el navegador real
    const browser = fullVersionList?.find(
      (b) => !b.brand.includes("Not") && !b.brand.includes("Chromium"),
    );

    return {
      model: highEntropy.model, // Modelo del dispositivo (si está disponible)
      browserName: browser?.brand || "unknown", // Nombre del navegador (ej: Chrome)
      browserVersion:
        browser?.version || highEntropy?.uaFullVersion || "unknown",
      //brands, // Marca y versión del navegador (ej: Chrome 114)
      mobile, // Es un dispositivo móvil o no
      language: nav.language || "unknown", // Idioma
      platform, // Plataforma (ej: Windows, macOS, Android)
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown", // Zona horaria
      connection: nav.connection?.effectiveType || "unknown", // Tipo de conexión (4g, 3g, etc)
      //browserVersion: highEntropy.uaFullVersion, // Versión completa del navegador
      platformVersion: highEntropy.platformVersion, // Versión del sistema operativo

      //userAgent: nav.userAgent, // Cadena completa del user agent
      //architecture: highEntropy.architecture, // Arquitectura del dispositivo
      //bitness: highEntropy.bitness, // 32 o 64 bits
      //deviceMemory: nav.deviceMemory || "unknown", // RAM disponible
    };
  } catch (error) {
    console.warn("userAgentData unavailable", error);
    return {
      userAgent: nav.userAgent,
      platform: nav.platform,
    };
  }
};
