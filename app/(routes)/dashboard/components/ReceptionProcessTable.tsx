"use client";

import { useEffect, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import TimelineIcon from "@mui/icons-material/Timeline";
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

import { EventData, ProcessEventRole, ReceptionProcess } from "@/types";
import { receptionProcessesService } from "@/services";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { useCurrentUser } from "@/common/UserContext";
import { useSocket } from "@/common/SocketProvider";
import { formatTime, Toast } from "@/utils";

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

interface Props {
  selectReceptionProcess: (receptionProcess: ReceptionProcess) => void;
}

const ReceptionProcessTable = ({ selectReceptionProcess }: Props) => {
  const [data, setData] = useState<ReceptionProcess[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(
    null,
  );
  const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);
  const [currentActionRole, setCurrentActionRole] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const currentUser = useCurrentUser();

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
    receptionProcessesService
      .findAll({
        startDate: new Date().toISOString().split("T")[0], // Solo procesos del día actual
      })
      .then(setData);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAuthorize = (
    e: React.MouseEvent,
    id: number,
    actionRole: string,
    currentStatusRow: string,
  ) => {
    e.stopPropagation();
    setSelectedProcessId(id);
    setOpenAuthDialog(true);
    setCurrentActionRole(actionRole);
    setCurrentStatus(currentStatusRow);
  };

  const handleConfirmAuthorize = () => {
    if (!selectedProcessId)
      return Toast.error("No se ha seleccionado ningún proceso.");

    if (!currentUser)
      return Toast.error("No se ha identificado el usuario actual.");

    setIsLoadingConfirm(true);

    const newState =
      currentActionRole === "autorizar" ? "autorizada" : "rechazada";

    let currentRole = currentUser.role;
    let actionRole = "";

    //TODO: Eliminar esto
    currentRole = [
      "LOGISTICA PENDIENTE DE AUTORIZACION",
      "LOGISTICA PENDIENTE DE CAPTURA PESO SAP",
    ].includes(currentStatus)
      ? ProcessEventRole.LOGISTICA
      : ["PRODUCCION PENDIENTE DE DESCARGA", "PRODUCCION DESCARGANDO"].includes(
            currentStatus,
          )
        ? ProcessEventRole.PRODUCCION
        : ProcessEventRole.CALIDAD;
    //TODO: Eliminar esto

    switch (currentRole) {
      case ProcessEventRole.LOGISTICA:
        if (currentStatus === "LOGISTICA PENDIENTE DE AUTORIZACION") {
          actionRole = "logistica-autorizo-ingreso";
        } else if (
          currentStatus === "LOGISTICA PENDIENTE DE CAPTURA PESO SAP"
        ) {
          actionRole = "logistica-capturo-peso-sap";
        }
        break;
      case ProcessEventRole.CALIDAD:
        if (currentStatus === "CALIDAD PROCESANDO") {
          if (newState === "autorizada") {
            actionRole = "calidad-aprobo-material";
          } else if (newState === "rechazada") {
            actionRole = "calidad-rechazo-material";
          }
        } else if (currentStatus === "CALIDAD PENDIENTE LIBERACION EN SAP") {
          actionRole = "calidad-libero-sap";
        }
        break;
      case ProcessEventRole.PRODUCCION:
        if (currentStatus === "PRODUCCION PENDIENTE DE DESCARGA") {
          actionRole = "produccion-descargando";
        } else if (currentStatus === "PRODUCCION DESCARGANDO") {
          actionRole = "descargado";
        }
        break;
    }

    receptionProcessesService
      .changeOfStatus({
        id: selectedProcessId,
        actionRole,
      })
      .then(() => {
        setIsLoadingConfirm(false);
        setOpenAuthDialog(false);
        setSelectedProcessId(null);
        Toast.success("Acción realizada con éxito.");
      });
  };

  const handleCloseAuthDialog = () => {
    setOpenAuthDialog(false);
    setSelectedProcessId(null);
    setIsLoadingConfirm(false);
  };

  const calculateProgress = (events: EventData[]): number => {
    if (!events || events.length === 0) return 0;

    const eventCount = events.length;
    const maxEvents = 12;

    return Math.min((eventCount / maxEvents) * 100, 100);
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

            const currentStatusRow = receptionProcess.events?.[
              receptionProcess.events.length - 1
            ]?.status.replace(/_/g, " ");

            const canAuthorize =
              currentStatusRow?.endsWith("AUTORIZACION") &&
              currentUser?.role !== ProcessEventRole.LOGISTICA; // TODO: Cambiar !=== por ===

            const canDecision =
              currentStatusRow?.endsWith("PROCESANDO") &&
              currentUser?.role !== ProcessEventRole.CALIDAD; // TODO: Cambiar !=== por ===

            const canDownload =
              currentStatusRow?.endsWith("PENDIENTE DE DESCARGA") &&
              currentUser?.role !== ProcessEventRole.PRODUCCION; // TODO: Cambiar !=== por ===

            const canEndDownload =
              currentStatusRow?.endsWith("PRODUCCION DESCARGANDO") &&
              currentUser?.role !== ProcessEventRole.PRODUCCION; // TODO: Cambiar !=== por ===

            const canCaptureWeight =
              currentStatusRow?.endsWith(
                "LOGISTICA PENDIENTE DE CAPTURA PESO SAP",
              ) && currentUser?.role !== ProcessEventRole.LOGISTICA; // TODO: Cambiar !=== por ===

            const canRelease =
              currentStatusRow?.includes("PENDIENTE LIBERACION") &&
              currentUser?.role !== ProcessEventRole.CALIDAD; // TODO: Cambiar !=== por ===

            const hasActions =
              canAuthorize ||
              canDecision ||
              canDownload ||
              canEndDownload ||
              canCaptureWeight ||
              canRelease;

            const progressValue = currentStatusRow?.includes("FINALIZO")
              ? 100
              : calculateProgress(receptionProcess.events);

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
                        {currentStatusRow ?? "Sin eventos"}
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
                        variant="inherit"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        #{receptionProcess.id}
                      </Typography>
                    </Stack>
                    {/* Contenedor de botones */}
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        justifyContent: hasActions
                          ? {
                              xs: "stretch",
                              sm: "space-between",
                            }
                          : {
                              xs: "stretch",
                              sm: "flex-start",
                            },
                        alignItems: "center",
                        gap: 1,
                        minHeight: { xs: 44, sm: 36 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      {/* Botón de Monitor en tiempo real */}
                      <Button
                        variant="contained"
                        startIcon={<TimelineIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          minHeight: { xs: 44, sm: 36 },
                          width: { xs: "100%", sm: "auto" },
                          backgroundImage: theme.gradients.primary,
                          color: theme.buttons.containedText,
                          boxShadow: theme.overlays.cardShadow,
                        }}
                        onClick={() => {
                          toggleExpanded(receptionProcess.id);
                          selectReceptionProcess(receptionProcess);
                        }}
                      >
                        Monitor
                      </Button>

                      {hasActions && (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{
                            width: { xs: "100%", sm: "auto" },
                            justifyContent: {
                              xs: "stretch",
                              sm: "flex-end",
                            },
                            alignItems: "stretch",
                          }}
                        >
                          {canDecision && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "rechazar",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<CloseIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.error?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.error?.dark,
                                },
                              }}
                            >
                              Rechazar
                            </Button>
                          )}
                          {(canAuthorize || canDecision) && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "autorizar",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.success?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.success?.dark,
                                },
                              }}
                            >
                              {canAuthorize ? "Autorizar" : "Aprobar"}
                            </Button>
                          )}
                          {canDownload && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "descargando",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<PriorityHighIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.warning?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.warning?.dark,
                                },
                              }}
                            >
                              Notificar inicio de descarga
                            </Button>
                          )}
                          {canEndDownload && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "descargado",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<PriorityHighIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.success?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.success?.dark,
                                },
                              }}
                            >
                              Notificar descarga completada
                            </Button>
                          )}
                          {canCaptureWeight && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "captura-peso-sap",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<PriorityHighIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.success?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.success?.dark,
                                },
                              }}
                            >
                              Notificar peso capturado en SAP
                            </Button>
                          )}
                          {canRelease && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "liberar-sap",
                                  currentStatusRow,
                                )
                              }
                              variant="contained"
                              size="small"
                              startIcon={<PriorityHighIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.success?.main,
                                minHeight: { xs: 44, sm: 36 },
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  backgroundColor: theme.palette.success?.dark,
                                },
                              }}
                            >
                              Notificar liberación de SAP
                            </Button>
                          )}
                        </Stack>
                      )}
                    </Box>
                    {/* Contenedor de botones */}
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        gridColumn: "1 / -1",
                        height: 6,
                        borderRadius: 10,
                        backgroundColor: theme.linearProgressTrack,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          background:
                            progressValue < 33
                              ? theme.palette.error?.main
                              : progressValue < 66
                                ? theme.palette.warning?.main
                                : theme.palette.success?.main,
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
                            Tiempo transcurrido
                            {receptionProcess.events &&
                              receptionProcess.events.length > 0 && (
                                <ElapsedTimeDisplay
                                  events={receptionProcess.events}
                                  isProcessFinalized={currentStatusRow.includes(
                                    "FINALIZO",
                                  )}
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
                                    {eventItem.id > 0 && receptionProcess.events
                                      ? (() => {
                                          const currentIndex =
                                            receptionProcess.events.findIndex(
                                              (e) => e.id === eventItem.id,
                                            );
                                          if (currentIndex > 0) {
                                            const prevEvent =
                                              receptionProcess.events[
                                                currentIndex - 1
                                              ];
                                            const prevTime = new Date(
                                              prevEvent.createdAt,
                                            ).getTime();
                                            const currTime = new Date(
                                              eventItem.createdAt,
                                            ).getTime();
                                            const diffMs = currTime - prevTime;
                                            const hours = Math.floor(
                                              diffMs / (1000 * 60 * 60),
                                            );
                                            const minutes = Math.floor(
                                              (diffMs % (1000 * 60 * 60)) /
                                                (1000 * 60),
                                            );
                                            const seconds = Math.floor(
                                              (diffMs % (1000 * 60)) / 1000,
                                            );
                                            return `${hours}h ${minutes}m ${seconds}s desde anterior`;
                                          }
                                          return "Primer evento";
                                        })()
                                      : "--"}
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

      {/* Dialog de Acción */}
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
          Confirmar acción
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
          ¿Estás seguro de que deseas{" "}
          <b>
            {currentActionRole === "descargando"
              ? "descargar"
              : currentActionRole === "autorizar"
                ? "autorizar"
                : "rechazar"}
          </b>{" "}
          esta operación? Esta acción no puede ser revertida.
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
            onClick={() => handleConfirmAuthorize()}
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
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReceptionProcessTable;
