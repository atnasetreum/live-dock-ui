"use client";
import { useEffect } from "react";

import { Space_Grotesk } from "next/font/google";

import { Box, Typography } from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { GlowLayer } from "@/theme/tokens";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const glowLayerStyles = (layer: GlowLayer) => ({
  content: '""',
  position: "absolute" as const,
  width: layer.width,
  height: layer.height,
  top: layer.top,
  left: layer.left,
  right: layer.right,
  bottom: layer.bottom,
  background: layer.gradient,
  filter: `blur(${layer.blur}px)`,
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useThemeConfig();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (_: unknown, callback: unknown) => {
      if (callback && typeof callback === "function") {
        setTimeout(callback, 100);
      }
    };

    socket.on("sessions:ready", handleSessionsReady);

    return () => {
      socket.off("sessions:ready", handleSessionsReady);
    };
  }, [socket]);

  return (
    <Box
      className={spaceGrotesk.className}
      sx={{
        minHeight: "100vh",
        background: theme.palette.pageBackground,
        color: theme.palette.textPrimary,
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 8 },
        position: "relative",
        overflow: "hidden",
        "::before": glowLayerStyles(theme.glows.primary),
        "::after": glowLayerStyles(theme.glows.secondary),
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1280,
          zIndex: 1,
        }}
      >
        {isConnected ? (
          <>{children}</>
        ) : (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              borderRadius: 4,
              background: theme.surfaces.panel,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.textSecondary }}
            >
              Conectando al servidor de datos en tiempo real...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
