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
  title: "LiveDock Control - Panel Operativo Portuario",
  description:
    "Panel de control en tiempo real para gestión de operaciones portuarias",
  applicationName: "LiveDock Control",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LiveDock Control",
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
    <html lang="en" className="hydrated">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <PWAInstaller />
      </body>
    </html>
  );
}
