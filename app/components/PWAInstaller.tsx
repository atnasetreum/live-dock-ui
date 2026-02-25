"use client";

import { useEffect } from "react";

import { Toast } from "@/utils";

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

  useEffect(() => {
    if ("serviceWorker" in navigator && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "NEW_VERSION") {
          Toast.info(event.data.message);
        }
      });
    }
  }, []);

  return null;
}
