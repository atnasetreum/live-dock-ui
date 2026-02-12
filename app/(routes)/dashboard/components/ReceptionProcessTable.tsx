"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { ReceptionProcess } from "@/types";

const ReceptionProcessTable = () => {
  const [data, setData] = useState<ReceptionProcess[]>([]);

  const { theme } = useThemeConfig();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (payload: ReceptionProcess) => {
      setData((prev) => [payload, ...prev]);
    };

    socket.on("reception-process:created", handleSessionsReady);

    return () => {
      socket.off("reception-process:created", handleSessionsReady);
    };
  }, [socket]);

  return (
    <Paper
      sx={{
        flex: 1,
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
        background: theme.surfaces.panel,
        border: `1px solid ${theme.surfaces.border}`,
        boxShadow: theme.overlays.panelShadow,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, color: theme.palette.textSecondary }}
          >
            Movimientos
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.textPrimary,
            }}
          >
            Operaciones de hoy
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.textSecondary }}
          >
            Seguimiento de buques y estado de atraque
          </Typography>
        </Box>
        <Chip
          label="Tiempo real"
          size="small"
          sx={{
            backgroundColor: theme.chips.realTime,
            color: theme.palette.textPrimary,
            fontWeight: 600,
          }}
        />
      </Stack>
      <Stack spacing={2.5}>
        {data.map((receptionProcess) => {
          console.log(receptionProcess);
          return (
            <Box
              key={receptionProcess.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 1.5,
                alignItems: "center",
                padding: 1.5,
                borderRadius: 2,
                backgroundColor: theme.surfaces.translucent,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.textPrimary,
                  }}
                >
                  {receptionProcess.typeOfMaterial}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Tipo de material
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.textPrimary,
                  }}
                >
                  {receptionProcess.status?.replace(/_/g, " ")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Estatus
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.textPrimary,
                  }}
                >
                  {receptionProcess.createdBy.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Creado por
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.textPrimary,
                  }}
                >
                  {new Date(receptionProcess.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Fecha de creación
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  receptionProcess.status === "Amarrado"
                    ? 100
                    : receptionProcess.status === "Zarpando"
                      ? 60
                      : 35
                }
                sx={{
                  height: 6,
                  borderRadius: 10,
                  backgroundColor: theme.linearProgressTrack,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,
                    background: theme.gradients.progress,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default ReceptionProcessTable;
