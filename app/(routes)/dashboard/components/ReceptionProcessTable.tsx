"use client";

import { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { receptionProcessesService } from "@/services";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { useSocket } from "@/common/SocketProvider";
import { formatTime, Toast } from "@/utils";
import {
  ProcessEventOption,
  ProcessEventRole,
  ProcessState,
  ReceptionProcess,
  User,
} from "@/types";

interface ProcessEvent {
  id: number;
  event: string;
  createdAt: string;
}

const ElapsedTimeDisplay = ({
  events,
  isProcessFinalized,
}: {
  events: ProcessEvent[];
  isProcessFinalized: boolean;
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!events || events.length === 0) return;

      const firstEventTime = new Date(events[0].createdAt).getTime();
      const lastEventTime = isProcessFinalized
        ? new Date(events[events.length - 1].createdAt).getTime()
        : new Date().getTime();
      const diffMs = lastEventTime - firstEventTime;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateElapsedTime();
    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [events, isProcessFinalized]);

  return <Typography variant="caption"> {elapsedTime}</Typography>;
};

const ReceptionProcessTable = () => {
  const [data, setData] = useState<ReceptionProcess[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(
    null,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);

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

    const handleSessionsCurrentUser = (user: User) => {
      setCurrentUser(user);
    };

    socket.on("sessions:current_user", handleSessionsCurrentUser);
    socket.on("reception-process:created", handleSessionsReady);

    return () => {
      socket.off("reception-process:created", handleSessionsReady);
      socket.off("sessions:current_user", handleSessionsCurrentUser);
    };
  }, [socket]);

  useEffect(() => {
    receptionProcessesService.findAll().then(setData);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAuthorize = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedProcessId(id);
    setOpenAuthDialog(true);
  };

  const handleConfirmAuthorize = (actionRole: string) => {
    if (selectedProcessId !== null) {
      setIsLoadingConfirm(true);
      receptionProcessesService
        .changeOfStatus({
          id: selectedProcessId,
          newState: "autorizada",
          actionRole,
          nextEvent: {
            event: ProcessEventOption.LOGISTICA_AUTORIZA_INGRESO,
            statusProcess:
              ProcessState.CALIDAD_PENDIENTE_DE_CONFIRMACION_DE_ANALISIS,
            eventRole: ProcessEventRole.LOGISTICA,
          },
        })
        .then(() => {
          setIsLoadingConfirm(false);
          setOpenAuthDialog(false);
          setSelectedProcessId(null);
          Toast.success("Operación autorizada exitosamente");
        });
    }
  };

  const handleCloseAuthDialog = () => {
    setOpenAuthDialog(false);
    setSelectedProcessId(null);
    setIsLoadingConfirm(false);
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

            const currentStatus = receptionProcess.events?.[
              receptionProcess.events.length - 1
            ]?.status.replace(/_/g, " ");

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
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: 1.5,
                    borderRadius: 2,
                    transition: "background-color 200ms ease",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.surfaces.panel,
                    },
                  }}
                  onClick={() => toggleExpanded(receptionProcess.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={`reception-process-${receptionProcess.id}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpanded(receptionProcess.id);
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "minmax(140px, 1fr) minmax(200px, 1.8fr) minmax(140px, 1fr) minmax(140px, 1fr)",
                      },
                      gap: { xs: 1.5, sm: 2 },
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontSize: "0.7rem",
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        Material
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.textPrimary,
                          lineHeight: 1.4,
                        }}
                      >
                        {receptionProcess.typeOfMaterial}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontSize: "0.7rem",
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        Estatus
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.textPrimary,
                          lineHeight: 1.4,
                        }}
                      >
                        {currentStatus ?? "Sin eventos"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontSize: "0.7rem",
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        Fecha creación
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.textPrimary,
                          lineHeight: 1.4,
                        }}
                      >
                        {formatTime(receptionProcess.createdAt)}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        justifyContent: {
                          xs: "space-between",
                          sm: "flex-start",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        Ver detalles (#{receptionProcess.id})
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
                    {currentStatus.endsWith("AUTORIZACION") &&
                      currentUser?.role !== ProcessEventRole.LOGISTICA && ( // TODO: Cambiar !=== por ===
                        <Button
                          onClick={(e) =>
                            handleAuthorize(e, receptionProcess.id)
                          }
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.875rem",
                            backgroundColor: theme.palette.success?.main,
                            gridColumn: { xs: "1 / -1", sm: "auto" },
                            "&:hover": {
                              backgroundColor: theme.palette.success?.dark,
                            },
                          }}
                        >
                          Autorizar
                        </Button>
                      )}
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
                </Box>
                <Collapse
                  in={isExpanded}
                  timeout="auto"
                  unmountOnExit
                  id={`reception-process-${receptionProcess.id}`}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ px: 1.5, pb: 1.5 }}>
                    <Stack spacing={2}>
                      {/* Info adicional visible solo en mobile cuando expandido */}
                      <Stack
                        spacing={1.5}
                        sx={{
                          display: { xs: "flex", sm: "none" },
                          padding: 1.5,
                          borderRadius: 2,
                          backgroundColor: theme.surfaces.panel,
                          border: `1px solid ${theme.surfaces.border}`,
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
                            Fecha de creación
                          </Typography>
                        </Box>
                      </Stack>

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
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.textPrimary }}
                          >
                            Tiempo transcurrido:
                            {receptionProcess.events &&
                              receptionProcess.events.length > 0 && (
                                <ElapsedTimeDisplay
                                  events={receptionProcess.events}
                                  isProcessFinalized={receptionProcess.events[
                                    receptionProcess.events.length - 1
                                  ]?.event.includes("FINALIZO")}
                                />
                              )}
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
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "minmax(220px, 2fr) minmax(140px, 1fr) minmax(140px, 1fr)",
                                  },
                                  gap: { xs: 1.5, sm: 2 },
                                  alignItems: "start",
                                  padding: { xs: 1.5, sm: 2 },
                                  borderRadius: 1.5,
                                  backgroundColor: theme.surfaces.translucent,
                                }}
                              >
                                <Stack spacing={1}>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.textSecondary,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      Evento
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: theme.palette.textPrimary,
                                        mt: 0.25,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {eventItem.event.replace(/_/g, " ")}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.textSecondary,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      Estatus
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        color: theme.palette.textPrimary,
                                        mt: 0.25,
                                      }}
                                    >
                                      {eventItem.status?.replace(/_/g, " ")}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.textSecondary,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    Responsable
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: theme.palette.textPrimary,
                                      mt: 0.25,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {eventItem.role !==
                                      ProcessEventRole.SISTEMA &&
                                      eventItem.createdBy.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.textSecondary,
                                      mt: 0.5,
                                      display: "block",
                                    }}
                                  >
                                    {eventItem.role}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.textSecondary,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    Fecha
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: theme.palette.textPrimary,
                                      mt: 0.25,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {formatTime(eventItem.createdAt)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.textSecondary,
                                      mt: 0.5,
                                      display: "block",
                                    }}
                                  >
                                    Fecha del evento
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

      {/* Dialog de Confirmación */}
      <Dialog
        open={openAuthDialog}
        onClose={handleCloseAuthDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor:
              theme.name === "dark"
                ? "rgba(10, 18, 50, 0.98)"
                : "rgba(255, 255, 255, 0.99)",
            border:
              theme.name === "dark"
                ? "2px solid rgba(255, 255, 255, 0.18)"
                : `1px solid ${theme.surfaces.border}`,
            boxShadow:
              theme.name === "dark"
                ? "0 0 60px rgba(0, 0, 0, 0.8), 0 25px 80px rgba(2, 7, 21, 0.7)"
                : theme.overlays.panelShadow,
            backgroundImage: "none",
            minWidth: "320px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.textPrimary,
            fontWeight: 700,
            fontSize: "1.35rem",
            paddingBottom: 1,
            borderBottom: `1px solid ${theme.surfaces.border}`,
          }}
        >
          Confirmar Autorización
        </DialogTitle>
        <DialogContent
          sx={{
            color: theme.palette.textSecondary,
            padding: 2,
            marginTop: 3,
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          ¿Estás seguro de que deseas autorizar esta operación? Esta acción no
          puede ser revertida.
        </DialogContent>
        <DialogActions
          sx={{
            padding: 2,
            gap: 1.5,
            borderTop: `1px solid ${theme.surfaces.border}`,
          }}
        >
          <Button
            onClick={handleCloseAuthDialog}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              borderColor: theme.surfaces.border,
              color: theme.palette.textSecondary,
              px: 3,
              "&:hover": {
                borderColor: theme.palette.textPrimary,
                backgroundColor: theme.surfaces.translucent,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() =>
              handleConfirmAuthorize(
                "logistica-autorizo-ingreso",
                /* currentUser?.role === ProcessEventRole.LOGISTICA// TODO: hacer pruebas con el rol
                  ? "logistica-autorizo-ingreso"
                  : "calidad-autorizo-ingresoo", */
              )
            }
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled={isLoadingConfirm}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: theme.palette.success?.main,
              color: "#ffffff",
              px: 3,
              "&:hover": {
                backgroundColor: theme.palette.success?.dark,
              },
            }}
          >
            Autorizar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReceptionProcessTable;
