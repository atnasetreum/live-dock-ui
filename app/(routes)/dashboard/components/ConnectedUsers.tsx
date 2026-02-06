"use client";

import { useEffect, useState } from "react";

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { UsersOnDuty } from "@/types";

const ConnectedUsers = () => {
  const { theme } = useThemeConfig();
  const { socket } = useSocket();
  const [users, setUsers] = useState<UsersOnDuty[]>([]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (payload: UsersOnDuty[]) => {
      setUsers(payload);
    };

    socket.on("sessions:current_users", handleSessionsReady);

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
        }}
        mb={2}
      >
        Equipo en turno
      </Typography>
      <List disablePadding>
        {users.map((user) => (
          <ListItem key={user.id} sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: theme.avatarBackground,
                  color: theme.palette.textPrimary,
                }}
              >
                {user.name[0].toLocaleUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              primaryTypographyProps={{
                sx: { color: theme.palette.textPrimary },
              }}
              /* secondary={`Rol ${roles[index] || roles[roles.length - 1]}`} */
              secondary={user.context.join(", ")}
              secondaryTypographyProps={{
                sx: { color: theme.listSecondary },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ConnectedUsers;
