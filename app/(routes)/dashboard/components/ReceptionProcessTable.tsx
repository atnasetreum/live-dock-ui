"use client";

import { useEffect, useState } from "react";

import {
  Box,
  ButtonBase,
  Chip,
  Collapse,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { ReceptionProcess } from "@/types";
import { receptionProcessesService } from "@/services";

const ReceptionProcessTable = () => {
  const [data, setData] = useState<ReceptionProcess[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { theme } = useThemeConfig();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (payload: ReceptionProcess) => {
      const currentId = payload.id;
      setData((prev) => {
        const exists = prev.some((item) => item.id === currentId);
        if (exists) {
          return prev.map((item) => (item.id === currentId ? payload : item));
        } else {
          return [payload, ...prev];
        }
      });
    };

    socket.on("reception-process:created", handleSessionsReady);

    return () => {
      socket.off("reception-process:created", handleSessionsReady);
    };
  }, [socket]);

  useEffect(() => {
    receptionProcessesService.findAll().then(setData);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatTime = (value?: string | Date | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            Seguimiento del proceso de recepción de pipa en tiempo real.
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
        {data.length ? (
          data.map((receptionProcess) => {
            const isExpanded = expandedId === receptionProcess.id;
            return (
              <Box
                key={receptionProcess.id}
                sx={{
                  borderRadius: 2,
                  backgroundColor: theme.surfaces.translucent,
                  border: `1px solid ${theme.surfaces.border}`,
                  overflow: "hidden",
                }}
              >
                <ButtonBase
                  onClick={() => toggleExpanded(receptionProcess.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`reception-process-${receptionProcess.id}`}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: 1.5,
                    alignItems: "stretch",
                    display: "block",
                    borderRadius: 2,
                    transition: "background-color 200ms ease",
                    "&:hover": {
                      backgroundColor: theme.surfaces.panel,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 1.5,
                      alignItems: "center",
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
                        {receptionProcess.events?.[
                          receptionProcess.events.length - 1
                        ]?.status.replace(/_/g, " ") ?? "Sin eventos"}
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
                        {formatTime(receptionProcess.createdAt)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        Fecha de creacion
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        Ver detalles
                      </Typography>
                      <ExpandMoreIcon
                        sx={{
                          color: theme.palette.textSecondary,
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Stack>
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
                        gridColumn: "1 / -1",
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
                </ButtonBase>
                <Collapse
                  in={isExpanded}
                  timeout="auto"
                  unmountOnExit
                  id={`reception-process-${receptionProcess.id}`}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ px: 1.5, pb: 1.5 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          padding: 1.5,
                          borderRadius: 2,
                          backgroundColor: theme.surfaces.panel,
                          border: `1px solid ${theme.surfaces.border}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.textPrimary }}
                          >
                            Eventos
                          </Typography>
                          <Chip
                            label={`${receptionProcess.events?.length ?? 0} eventos`}
                            size="small"
                            sx={{
                              backgroundColor: theme.surfaces.translucent,
                              color: theme.palette.textSecondary,
                            }}
                          />
                        </Stack>
                        <Stack spacing={1.25} mt={1.5}>
                          {receptionProcess.events?.length ? (
                            receptionProcess.events.map((eventItem) => (
                              <Box
                                key={eventItem.id}
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "minmax(160px, 1.2fr) minmax(140px, 1fr) minmax(120px, 0.8fr)",
                                  gap: 1,
                                  alignItems: "center",
                                  padding: 1.25,
                                  borderRadius: 1.5,
                                  backgroundColor: theme.surfaces.translucent,
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: theme.palette.textPrimary,
                                    }}
                                  >
                                    Evento: {eventItem.event.replace(/_/g, " ")}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: theme.palette.textSecondary }}
                                  >
                                    Estatus:{" "}
                                    {eventItem.status?.replace(/_/g, " ")}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: theme.palette.textPrimary }}
                                  >
                                    {eventItem.createdBy.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: theme.palette.textSecondary }}
                                  >
                                    Rol: {eventItem.role}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: theme.palette.textPrimary }}
                                  >
                                    {formatTime(eventItem.createdAt)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: theme.palette.textSecondary }}
                                  >
                                    {formatDateTime(eventItem.createdAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.textSecondary }}
                            >
                              Sin eventos registrados.
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      {/* // Metricas */}
                      {/* <Box
                      sx={{
                        padding: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.surfaces.panel,
                        border: `1px solid ${theme.surfaces.border}`,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.textPrimary }}
                        >
                          Metricas
                        </Typography>
                        <Chip
                          label={`${receptionProcess.metrics?.length ?? 0} metricas`}
                          size="small"
                          sx={{
                            backgroundColor: theme.surfaces.translucent,
                            color: theme.palette.textSecondary,
                          }}
                        />
                      </Stack>
                      <Stack spacing={1.25} mt={1.5}>
                        {receptionProcess.metrics?.length ? (
                          receptionProcess.metrics.map((metric) => (
                            <Box
                              key={metric.id}
                              sx={{
                                display: "grid",
                                gridTemplateColumns:
                                  "minmax(150px, 1fr) minmax(140px, 1fr) minmax(140px, 1fr)",
                                gap: 1,
                                alignItems: "center",
                                padding: 1.25,
                                borderRadius: 1.5,
                                backgroundColor: theme.surfaces.translucent,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.textPrimary,
                                  }}
                                >
                                  {metric.eventType}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: theme.palette.textSecondary }}
                                >
                                  Tipo de evento
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: theme.palette.textPrimary }}
                                >
                                  {formatDateTime(metric.visibleAt)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: theme.palette.textSecondary }}
                                >
                                  Visible en
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: theme.palette.textPrimary }}
                                >
                                  {metric.reactionTimeSec ?? "--"}s /{" "}
                                  {metric.systemDelaySec ?? "--"}s
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: theme.palette.textSecondary }}
                                >
                                  Reaccion / Sistema
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            Sin metricas registradas.
                          </Typography>
                        )}
                      </Stack>
                    </Box> */}
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            );
          })
        ) : (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.textSecondary }}
          >
            No hay operaciones registradas aún.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default ReceptionProcessTable;
