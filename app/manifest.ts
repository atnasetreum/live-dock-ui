import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mesa de control",
    short_name: "Mesa de control",
    description:
      "Supervisa cada etapa de recepción, registra eventos críticos y da seguimiento en tiempo real desde un panel central para vigilancia y operación.",
    scope: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#1976d2",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-pwa.png",
        sizes: "any",
        type: "image/png",
      },
      /* {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      }, */
    ],
  };
}
