"use client";

import { useEffect } from "react";

export default function PWAInstaller() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
        })
        .then((registration) => {
          console.log("[PWA] Service Worker registrado:", registration.scope);
        })
        .catch((error) => {
          console.error("[PWA] Error al registrar Service Worker:", error);
        });
    }
  }, []);

  return null;
}
