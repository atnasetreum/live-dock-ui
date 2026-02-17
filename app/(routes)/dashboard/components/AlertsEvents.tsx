"use client";

import { useEffect, useState } from "react";

import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useCurrentUser } from "@/common/UserContext";
import { useSocket } from "@/common/SocketProvider";
import { receptionProcessesService } from "@/services";

const AlertsEvents = () => {
  const { theme } = useThemeConfig();
  const { socket } = useSocket();
  const [alerts, setAlerts] = useState<
    {
      title: string;
      detail: string;
      severity: "Alta" | "Media" | "Baja";
    }[]
  >([]);

  const currentUser = useCurrentUser();

  useEffect(() => {
    receptionProcessesService
      .findAllPriorityAlerts({
        startDate: new Date().toISOString().split("T")[0],
      })
      .then(setAlerts);
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handleEventsProcessUpdated = (event: {
      title: string;
      detail: string;
      severity: "Alta" | "Media" | "Baja";
    }) => {
      console.log({ event });
      setAlerts((prev) => [event, ...prev]);
    };

    socket.on(`LOGISTICA:events-process-updated`, handleEventsProcessUpdated);
    socket.on(`CALIDAD:events-process-updated`, handleEventsProcessUpdated);
    socket.on(`PRODUCCION:events-process-updated`, handleEventsProcessUpdated);

    /* socket.on(
      `${currentUser.role}:events-process-updated`,
      handleEventsProcessUpdated,
    ); */

    return () => {
      socket.off(
        `LOGISTICA:events-process-updated`,
        handleEventsProcessUpdated,
      );
      socket.off(`CALIDAD:events-process-updated`, handleEventsProcessUpdated);
      socket.off(
        `PRODUCCION:events-process-updated`,
        handleEventsProcessUpdated,
      );
      /* socket.off(
        `${currentUser.role}:events-process-updated`,
        handleEventsProcessUpdated,
      ); */
    };
  }, [socket, currentUser]);

  const severityColor = (level: string) => {
    if (level === "Alta") return theme.chips.high;
    if (level === "Media") return theme.chips.medium;
    return theme.chips.low;
  };

  return (
    <Paper
      sx={{
        borderRadius: 4,
        p: 3,
        background: theme.surfaces.panel,
        border: `1px solid ${theme.surfaces.border}`,
        boxShadow: theme.overlays.panelShadow,
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 3 }}>
        Alertas
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: theme.palette.textPrimary,
        }}
        mb={1.5}
      >
        Alertas prioritarias
      </Typography>
      <Divider sx={{ borderColor: theme.divider }} />
      <Stack spacing={2} mt={2}>
        {alerts.map((alert) => (
          <Box key={alert.title}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.textPrimary,
                }}
              >
                {alert.title}
              </Typography>
              <Chip
                label={alert.severity}
                size="small"
                sx={{
                  backgroundColor: severityColor(alert.severity),
                  color: theme.palette.textPrimary,
                }}
              />
            </Stack>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.textSecondary }}
            >
              {alert.detail}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default AlertsEvents;
