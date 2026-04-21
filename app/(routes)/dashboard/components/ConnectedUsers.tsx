"use client";

import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Chip,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { UsersOnDuty } from "@/types";

const ConnectedUsers = () => {
  const { theme } = useThemeConfig();
  const { socket } = useSocket();
  const [users, setUsers] = useState<UsersOnDuty[]>([]);

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return "--";

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (payload: UsersOnDuty[]) => {
      setUsers(payload);
    };

    socket.on("sessions:current_users", handleSessionsReady);

    socket.emit("sessions:get_current_users");

    return () => {
      socket.off("sessions:current_users", handleSessionsReady);
    };
  }, [socket]);

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
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: theme.palette.textPrimary,
          mb: 2,
        }}
      >
        Equipo en turno
      </Typography>
      <List disablePadding>
        {users.length ? (
          users.map((user) => (
            <ListItem key={user.id} sx={{ px: 0, pb: 1.25 }}>
              <Box
                sx={{
                  width: "100%",
                  p: 1.35,
                  borderRadius: 2,
                  backgroundColor: theme.surfaces.translucent,
                  border: `1px solid ${theme.surfaces.border}`,
                }}
              >
                <Stack spacing={1.1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: 0.45,
                        }}
                      >
                        Usuario
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: theme.palette.textPrimary,
                          fontWeight: 700,
                        }}
                      >
                        {user.name}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: theme.avatarBackground,
                        color: theme.palette.textPrimary,
                        width: 34,
                        height: 34,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                      }}
                    >
                      {getUserInitials(user.name)}
                    </Avatar>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    useFlexGap
                    sx={{
                      flexWrap: "wrap"
                    }}
                  >
                    <Chip
                      size="small"
                      label={`Rol: ${user.role}`}
                      sx={{
                        backgroundColor: theme.surfaces.panel,
                        color: theme.palette.textPrimary,
                        border: `1px solid ${theme.surfaces.border}`,
                        fontWeight: 700,
                      }}
                    />
                    <Chip
                      size="small"
                      label={`ID: ${user.id}`}
                      sx={{
                        backgroundColor: theme.surfaces.panel,
                        color: theme.palette.textPrimary,
                        border: `1px solid ${theme.surfaces.border}`,
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 0.45,
                      }}
                    >
                      Dispositivo conectado
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.listSecondary, fontWeight: 500 }}
                    >
                      {user.context.length
                        ? user.context
                            .join(", ")
                            .replaceAll("desktop", "Computadora")
                            .replaceAll("mobile", "Movil")
                        : "Sin contexto registrado"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.textSecondary }}
          >
            Sin usuarios conectados.
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default ConnectedUsers;
