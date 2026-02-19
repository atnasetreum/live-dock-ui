"use client";

import { useEffect, useState } from "react";

//import TimelineIcon from "@mui/icons-material/Timeline";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

import { authService, pushNotificationsService } from "@/services";
import { webPushService } from "@/services/web-push.service";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { useCurrentUser } from "@/common/UserContext";
import { disconnectSocket } from "@/libs/socket";
import { ProcessEventRole } from "@/types";
import { Toast } from "@/utils";

const statusChips = [{ label: "Monitoreo en tiempo real", tone: "info" }];

const MainBanner = ({ onPipaIngreso }: { onPipaIngreso: () => void }) => {
  const { theme } = useThemeConfig();
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isPushBusy, setIsPushBusy] = useState(false);
  const [pushPermission, setPushPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported");
  const [userId, setUserId] = useState("");

  const currentUser = useCurrentUser();

  useEffect(() => {
    const refreshPushStatus = async () => {
      if (typeof window === "undefined") return;
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        setPushPermission("unsupported");
        setIsPushEnabled(false);
        return;
      }

      setPushPermission(Notification.permission);

      if (Notification.permission !== "granted") {
        setIsPushEnabled(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsPushEnabled(Boolean(subscription));
    };

    refreshPushStatus();
  }, []);

  const handleTogglePush = async () => {
    if (isPushBusy) return;

    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      Toast.error("Este navegador no soporta notificaciones push.");
      return;
    }

    setIsPushBusy(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      if (isPushEnabled) {
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          // Notificar al backend antes de hacer unsubscribe
          await webPushService.unsubscribe(subscription);
          await subscription.unsubscribe();
        }

        setIsPushEnabled(false);
        Toast.success("Notificaciones desactivadas.");
        return;
      }

      if (Notification.permission === "denied") {
        Toast.error(
          "El permiso de notificaciones esta bloqueado en el navegador.",
        );
        return;
      }

      let permission: NotificationPermission = Notification.permission;

      if (permission !== "granted") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        Toast.info("Permiso de notificaciones no concedido.");
        return;
      }

      const existingSubscription =
        await registration.pushManager.getSubscription();

      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: await webPushService.getPublicKey(),
        }));

      await webPushService.createSubscribe(subscription);

      setIsPushEnabled(true);
      setPushPermission("granted");
      Toast.success("Notificaciones activadas.");
    } catch (error) {
      console.error("Push toggle failed:", error);
      Toast.error("No se pudo actualizar el estado de notificaciones.");
    } finally {
      setIsPushBusy(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Paper
      sx={{
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        background: theme.surfaces.panel,
        border: `1px solid ${theme.surfaces.border}`,
        boxShadow: theme.overlays.panelShadow,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Button
            variant={isPushEnabled ? "contained" : "outlined"}
            startIcon={
              isPushEnabled ? (
                <NotificationsActiveIcon />
              ) : (
                <NotificationsOffIcon />
              )
            }
            onClick={handleTogglePush}
            disabled={isPushBusy || pushPermission === "unsupported"}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minHeight: 44,
              mb: 1,
              width: { xs: "100%", md: "auto" },
              borderColor: theme.buttons.outlinedColor,
              color: isPushEnabled
                ? theme.buttons.containedText
                : theme.buttons.outlinedColor,
              backgroundImage: isPushEnabled ? theme.gradients.primary : "none",
              boxShadow: isPushEnabled ? theme.overlays.cardShadow : "none",
              "&:hover": {
                borderColor: theme.buttons.outlinedColor,
                backgroundColor: isPushEnabled
                  ? "transparent"
                  : theme.surfaces.translucent,
              },
            }}
          >
            {isPushEnabled
              ? "Notificaciones activas"
              : "Activar notificaciones"}
          </Button>
          <br />
          <Typography
            variant="overline"
            sx={{ letterSpacing: 4, color: theme.palette.textPrimary }}
          >
            BIENVENIDO
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.1,
              color: theme.palette.textPrimary,
            }}
          >
            # {currentUser.id} {currentUser.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.textSecondary }}
          >
            Seguimiento en tiempo real del flujo de recepción de pipas.
          </Typography>
        </Box>
        <Stack spacing={2} width={{ xs: "100%", md: "auto" }}>
          {currentUser.role === ProcessEventRole.VIGILANCIA && (
            <Button
              variant="outlined"
              startIcon={<LocalShippingIcon />}
              onClick={onPipaIngreso}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
                backgroundImage: theme.gradients.primary,
                color: theme.buttons.containedText,
                boxShadow: theme.overlays.cardShadow,
              }}
            >
              Registrar ingreso de pipa
            </Button>
          )}
          {/* <Button
            variant="contained"
            startIcon={<TimelineIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minHeight: 44,
              backgroundImage: theme.gradients.primary,
              color: theme.buttons.containedText,
              boxShadow: theme.overlays.cardShadow,
            }}
            onClick={() => setRealTimeMonitor(true)}
          >
            Monitor en tiempo real
          </Button> */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              authService.logout().then(() => {
                disconnectSocket();
                setTimeout(() => {
                  window.location.replace("/");
                }, 50);
              });
            }}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minHeight: 44,
              borderColor: theme.buttons.outlinedColor,
              color: theme.buttons.outlinedColor,
              "&:hover": {
                borderColor: theme.buttons.outlinedColor,
                backgroundColor: theme.surfaces.translucent,
              },
            }}
          >
            Cerrar sesión
          </Button>
          {currentUser.email === "eduardo-266@hotmail.com" && (
            <>
              <TextField
                type="text"
                placeholder="ID de usuario"
                value={userId}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setUserId(value);
                }}
                size="small"
                sx={{
                  width: { xs: "100%", md: "auto" },
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    color: theme.palette.textPrimary,
                    "& fieldset": {
                      borderColor: theme.buttons.outlinedColor,
                    },
                  },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<NotificationsActiveIcon />}
                onClick={() => {
                  pushNotificationsService
                    .allTest(userId)
                    .then(({ message }) => {
                      Toast.success(message);
                    });
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  mb: 1,
                  width: { xs: "100%", md: "auto" },
                  borderColor: theme.buttons.outlinedColor,
                  color: theme.buttons.outlinedColor,
                  "&:hover": {
                    borderColor: theme.buttons.outlinedColor,
                    backgroundColor: theme.surfaces.translucent,
                  },
                }}
              >
                Probar notificaciones
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={1.5}
        flexWrap="wrap"
        mt={{ xs: 2, md: 3 }}
      >
        {statusChips.map((chip) => (
          <Chip
            key={chip.label}
            label={chip.label}
            size="small"
            sx={{
              backgroundColor: theme.surfaces.translucent,
              color: theme.palette.textPrimary,
              fontWeight: 600,
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default MainBanner;
