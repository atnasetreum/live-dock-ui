"use client";

import { useEffect, useState } from "react";

import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import LogoutIcon from "@mui/icons-material/Logout";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { disconnectSocket } from "@/libs/socket";
import { authService } from "@/services";
import { Toast } from "@/utils";
import { User } from "@/types";

const statusChips = [
  { label: "Terminal activa", tone: "success" },
  { label: "Turno 08:00 - 18:00", tone: "neutral" },
  { label: "Clima estable", tone: "info" },
];

const MainBanner = ({
  setRealTimeMonitor,
}: {
  setRealTimeMonitor: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { theme } = useThemeConfig();
  const { socket } = useSocket();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsCurrentUser = (user: User) => {
      setCurrentUser(user);
    };

    socket.on("sessions:current_user", handleSessionsCurrentUser);

    return () => {
      socket.off("sessions:current_user", handleSessionsCurrentUser);
    };
  }, [socket]);

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
            {currentUser.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.textSecondary }}
          >
            Seguimiento en tiempo real de flota, recursos y alertas críticas
            para tu terminal.
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width={{ xs: "100%", md: "auto" }}
        >
          <Button
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
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              authService.logout().then(({ message }) => {
                Toast.success(message);
                setTimeout(() => {
                  disconnectSocket();
                  window.location.replace("/");
                }, 1500);
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
