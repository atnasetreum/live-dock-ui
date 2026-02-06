import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LiveDock Control",
    short_name: "LiveDock",
    description:
      "Panel de control operativo para gestión portuaria en tiempo real",
    scope: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#1976d2",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
