import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";

import Providers from "./providers";
import PWAInstaller from "./components/PWAInstaller";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesa de control",
  description:
    "Supervisa cada etapa de recepción, registra eventos críticos y da seguimiento en tiempo real desde un panel central para vigilancia y operación.",
  applicationName: "Mesa de control",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mesa de control",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1976d2" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="hydrated">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <PWAInstaller />
      </body>
    </html>
  );
}
