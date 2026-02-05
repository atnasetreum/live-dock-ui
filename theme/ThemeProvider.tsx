"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeName, ThemePreference, ThemeTokens } from "./tokens";
import { themes } from "./tokens";

const STORAGE_KEY = "live-dock-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedName: ThemeName;
  theme: ThemeTokens;
  setPreference: (preference: ThemePreference) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Read from localStorage after mount
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") {
      setPreference(stored);
    }
    // Read system preference after mount
    setSystemTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference, mounted]);

  const resolvedName: ThemeName =
    preference === "system" ? systemTheme : preference;

  const theme = themes[resolvedName];

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty("color-scheme", resolvedName);
    root.dataset.theme = resolvedName;
    document.body.style.background = theme.palette.pageBackground;
    document.body.style.color = theme.palette.textPrimary;
  }, [resolvedName, theme, mounted]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedName,
      theme,
      setPreference,
    }),
    [preference, resolvedName, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeConfig = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeConfig must be used within ThemeProvider");
  }
  return context;
};
