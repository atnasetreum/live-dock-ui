export type ThemeName = "dark" | "light";
export type ThemePreference = ThemeName | "system";

export type GlowLayer = {
  width: number;
  height: number;
  blur: number;
  gradient: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
};

export type ThemeTokens = {
  name: ThemeName;
  palette: {
    pageBackground: string;
    textPrimary: string;
    textSecondary: string;
    success?: {
      main: string;
      dark: string;
    };
    warning?: {
      main: string;
      dark: string;
    };
    error?: {
      main: string;
      dark: string;
    };
    errorTranslucent: string;
  };
  surfaces: {
    card: string;
    panel: string;
    glass: string;
    translucent: string;
    border: string;
    iconBox: string;
  };
  gradients: {
    primary: string;
    progress: string;
  };
  glows: {
    primary: GlowLayer;
    secondary: GlowLayer;
  };
  chips: {
    high: string;
    medium: string;
    low: string;
    realTime: string;
  };
  forms: {
    fieldBackground: string;
    labelBackground: string;
    inputColor: string;
    adornmentColor: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    focusShadow: string;
  };
  overlays: {
    cardShadow: string;
    panelShadow: string;
    glassShadow: string;
  };
  avatarBackground: string;
  divider: string;
  linearProgressTrack: string;
  listSecondary: string;
  buttons: {
    containedText: string;
    outlinedColor: string;
  };
};

export const darkTheme: ThemeTokens = {
  name: "dark",
  palette: {
    pageBackground: "linear-gradient(135deg, #040a1c, #0f2557 38%, #17507b)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.78)",
    success: {
      main: "#4caf50",
      dark: "#388e3c",
    },
    warning: {
      main: "#ff9800",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      dark: "#d32f2f",
    },
    errorTranslucent: "rgba(244,67,54,0.2)",
  },
  surfaces: {
    card: "rgba(7,11,32,0.72)",
    panel: "rgba(7,11,32,0.85)",
    glass: "rgba(7, 11, 32, 0.82)",
    translucent: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.08)",
    iconBox: "rgba(33,150,243,0.12)",
  },
  gradients: {
    primary: "linear-gradient(90deg, #1c6fe8, #23a6d9)",
    progress: "linear-gradient(90deg, #1c6fe8, #23a6d9)",
  },
  glows: {
    primary: {
      width: 600,
      height: 600,
      gradient:
        "radial-gradient(circle, rgba(73,118,255,0.42), transparent 60%)",
      top: -200,
      left: -120,
      blur: 18,
    },
    secondary: {
      width: 380,
      height: 380,
      gradient:
        "radial-gradient(circle, rgba(7,181,159,0.55), transparent 65%)",
      bottom: -90,
      right: -120,
      blur: 16,
    },
  },
  chips: {
    high: "rgba(239,83,80,0.25)",
    medium: "rgba(255,167,38,0.2)",
    low: "rgba(76,175,80,0.2)",
    realTime: "rgba(33,150,243,0.2)",
  },
  forms: {
    fieldBackground: "rgba(10,18,46,0.4)",
    labelBackground: "rgba(7,11,32,0.92)",
    inputColor: "#ffffff",
    adornmentColor: "#ffffff",
    border: "rgba(255,255,255,0.78)",
    borderHover: "rgba(255,255,255,0.92)",
    borderFocus: "#fefefe",
    focusShadow: "0 0 0 1px rgba(255,255,255,0.32)",
  },
  overlays: {
    cardShadow: "0 25px 65px rgba(2,7,21,0.4)",
    panelShadow: "0 30px 80px rgba(2,7,21,0.5)",
    glassShadow: "0 30px 80px rgba(2,7,21,0.65)",
  },
  avatarBackground: "rgba(33,150,243,0.28)",
  divider: "rgba(255,255,255,0.18)",
  linearProgressTrack: "rgba(255,255,255,0.12)",
  listSecondary: "rgba(255,255,255,0.72)",
  buttons: {
    containedText: "#ffffff",
    outlinedColor: "#ffffff",
  },
};

export const lightTheme: ThemeTokens = {
  name: "light",
  palette: {
    pageBackground: "linear-gradient(135deg, #fefefe, #e6f0ff 42%, #d3f3ff)",
    textPrimary: "#0b1b2d",
    textSecondary: "rgba(11,27,45,0.72)",
    success: {
      main: "#66bb6a",
      dark: "#2e7d32",
    },
    warning: {
      main: "#ffa726",
      dark: "#ef6c00",
    },
    error: {
      main: "#ef5350",
      dark: "#c62828",
    },
    errorTranslucent: "rgba(244,67,54,0.2)",
  },
  surfaces: {
    card: "rgba(255,255,255,0.9)",
    panel: "rgba(255,255,255,0.95)",
    glass: "rgba(255,255,255,0.92)",
    translucent: "rgba(11,27,45,0.04)",
    border: "rgba(11,27,45,0.12)",
    iconBox: "rgba(25,118,210,0.12)",
  },
  gradients: {
    primary: "linear-gradient(90deg, #2563eb, #06b6d4)",
    progress: "linear-gradient(90deg, #2563eb, #06b6d4)",
  },
  glows: {
    primary: {
      width: 540,
      height: 540,
      gradient:
        "radial-gradient(circle, rgba(39,102,255,0.24), transparent 65%)",
      top: -160,
      left: -80,
      blur: 28,
    },
    secondary: {
      width: 360,
      height: 360,
      gradient:
        "radial-gradient(circle, rgba(13,148,136,0.22), transparent 70%)",
      bottom: -70,
      right: -100,
      blur: 30,
    },
  },
  chips: {
    high: "rgba(211,47,47,0.18)",
    medium: "rgba(255,143,0,0.2)",
    low: "rgba(76,175,80,0.22)",
    realTime: "rgba(37,99,235,0.14)",
  },
  forms: {
    fieldBackground: "rgba(255,255,255,0.92)",
    labelBackground: "rgba(255,255,255,0.95)",
    inputColor: "#0b1b2d",
    adornmentColor: "#0b1b2d",
    border: "rgba(11,27,45,0.32)",
    borderHover: "rgba(11,27,45,0.45)",
    borderFocus: "#0b1b2d",
    focusShadow: "0 0 0 1px rgba(11,27,45,0.18)",
  },
  overlays: {
    cardShadow: "0 20px 55px rgba(13,38,76,0.18)",
    panelShadow: "0 25px 65px rgba(13,38,76,0.16)",
    glassShadow: "0 25px 65px rgba(13,38,76,0.12)",
  },
  avatarBackground: "rgba(25,118,210,0.18)",
  divider: "rgba(11,27,45,0.12)",
  linearProgressTrack: "rgba(11,27,45,0.08)",
  listSecondary: "rgba(11,27,45,0.64)",
  buttons: {
    containedText: "#ffffff",
    outlinedColor: "#0b1b2d",
  },
};

export const themes: Record<ThemeName, ThemeTokens> = {
  dark: darkTheme,
  light: lightTheme,
};
