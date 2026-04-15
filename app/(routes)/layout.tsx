"use client";
import { useEffect, useState } from "react";

import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";

import { Box, Button, Stack, Typography } from "@mui/material";

import PushNotificationRequest from "./components/PushNotificationRequest";
import { webPushService } from "@/services/web-push.service";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { UserProvider } from "@/common/UserContext";
import { GlowLayer } from "@/theme/tokens";
import { ProcessEventRole, UsersOnDuty } from "@/types";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UsersOnDuty | null>(null);
  const pathname = usePathname();

  const { theme } = useThemeConfig();
  const { socket, isConnected } = useSocket();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const isUsersRoute = pathname?.startsWith("/users");

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

  useEffect(() => {
    const notifyPermission = () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") return;

        setIsOpen(true);
      } else {
        console.log("Notification API not supported.");
      }
    };

    notifyPermission();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsCurrentUser = (user: UsersOnDuty) => {
      setCurrentUser(user);
    };

    socket.on("sessions:current_user", handleSessionsCurrentUser);

    return () => {
      socket.off("sessions:current_user", handleSessionsCurrentUser);
    };
  }, [socket]);

  const handleNotificationPermisson = (confirm: boolean) => {
    if (!confirm) return setIsOpen(false);

    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;

        console.log("Notification permission granted.");

        webPushService.getPublicKey().then((publicKey) => {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey,
            })
            .then((subscription) => {
              console.log("Push subscription successful:", subscription);
              webPushService.createSubscribe(subscription).then(() => {
                // Notification test
                registration.showNotification("Test", {
                  body: "¡Notificaciones  activadas correctamente!",
                  icon: "/icons/icon-192x192.png",
                  badge: "/push-notifications/badge.png",
                });
                window.location.reload();
              });
            })
            .catch((error) => {
              console.error("Push subscription failed:", error);
            });
        });
      } else {
        console.log("Notification permission denied.");
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      <PushNotificationRequest
        isOpen={isOpen}
        handleClose={handleNotificationPermisson}
      />
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
            currentUser ? (
              <UserProvider currentUser={currentUser}>
                <Stack spacing={3}>
                  {currentUser.role === ProcessEventRole.ADMIN && (
                    <Box
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 4,
                        background: theme.surfaces.glass,
                        border: `1px solid ${theme.surfaces.border}`,
                        boxShadow: theme.overlays.glassShadow,
                        backdropFilter: "blur(10px)",
                        position: "sticky",
                        top: 12,
                        zIndex: 20,
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                        justifyContent="space-between"
                      >
                        <Stack spacing={0.4}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AdminPanelSettingsRoundedIcon
                              sx={{
                                color: theme.palette.textPrimary,
                                fontSize: 20,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.textPrimary,
                                lineHeight: 1.15,
                              }}
                            >
                              Menu ADMIN
                            </Typography>
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            Navegacion administrativa
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{
                            p: 0.6,
                            borderRadius: 3,
                            background: theme.surfaces.translucent,
                            border: `1px solid ${theme.surfaces.border}`,
                          }}
                        >
                          <Button
                            component={Link}
                            href="/dashboard"
                            startIcon={<DashboardRoundedIcon />}
                            variant={
                              isDashboardRoute ? "contained" : "outlined"
                            }
                            sx={{
                              textTransform: "none",
                              justifyContent: "flex-start",
                              fontWeight: 700,
                              minHeight: 40,
                              px: 1.4,
                              minWidth: { xs: "100%", sm: 154 },
                              backgroundImage: isDashboardRoute
                                ? theme.gradients.primary
                                : "none",
                              color: isDashboardRoute
                                ? theme.buttons.containedText
                                : theme.buttons.outlinedColor,
                              borderColor: theme.buttons.outlinedColor,
                              backgroundColor: isDashboardRoute
                                ? undefined
                                : theme.surfaces.card,
                              "&:hover": {
                                borderColor: theme.buttons.outlinedColor,
                                backgroundColor: isDashboardRoute
                                  ? undefined
                                  : theme.surfaces.translucent,
                              },
                            }}
                          >
                            Dashboard
                          </Button>
                          <Button
                            component={Link}
                            href="/users"
                            startIcon={<GroupRoundedIcon />}
                            variant={isUsersRoute ? "contained" : "outlined"}
                            sx={{
                              textTransform: "none",
                              justifyContent: "flex-start",
                              fontWeight: 700,
                              minHeight: 40,
                              px: 1.4,
                              minWidth: { xs: "100%", sm: 154 },
                              backgroundImage: isUsersRoute
                                ? theme.gradients.primary
                                : "none",
                              color: isUsersRoute
                                ? theme.buttons.containedText
                                : theme.buttons.outlinedColor,
                              borderColor: theme.buttons.outlinedColor,
                              backgroundColor: isUsersRoute
                                ? undefined
                                : theme.surfaces.card,
                              "&:hover": {
                                borderColor: theme.buttons.outlinedColor,
                                backgroundColor: isUsersRoute
                                  ? undefined
                                  : theme.surfaces.translucent,
                              },
                            }}
                          >
                            Usuarios
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                  {children}
                </Stack>
              </UserProvider>
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
                  aria-live="polite"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Cargando datos del usuario en turno…
                </Typography>
              </Box>
            )
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
                aria-live="polite"
                sx={{ color: theme.palette.textSecondary }}
              >
                Conectando al servidor de datos en tiempo real…
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
