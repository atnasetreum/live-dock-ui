"use client";

import { useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";

import { EventData, ProcessEventRole, ReceptionProcess } from "@/types";
import { receptionProcessesService } from "@/services";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { useCurrentUser } from "@/common/UserContext";
import TimeLineEvents from "./TimeLineEvents";
import { formatTime, getClientInfo, Toast } from "@/utils";

interface Props {
  selectReceptionProcess: (receptionProcess: ReceptionProcess) => void;
  data: ReceptionProcess[];
}

const ReceptionProcessTable = ({ selectReceptionProcess, data }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(
    null,
  );
  const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);
  const [currentActionRole, setCurrentActionRole] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [rejectionNotes, setRejectionNotes] = useState<string>("");
  const currentUser = useCurrentUser();

  const { theme } = useThemeConfig();

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
    setRejectionNotes("");
  };

  const handleConfirmAuthorize = async () => {
    if (!selectedProcessId)
      return Toast.error("No se ha seleccionado ningún proceso.");

    if (!currentUser)
      return Toast.error("No se ha identificado el usuario actual.");

    const isRejectAction = currentActionRole === "rechazar";
    const rejectionNotesTrimmed = rejectionNotes.trim();

    if (isRejectAction && !rejectionNotesTrimmed) {
      return Toast.error("Debes capturar el motivo de rechazo.");
    }

    setIsLoadingConfirm(true);

    if (
      currentActionRole === "confirmacion_ingreso_metric" ||
      currentActionRole === "confirmacion_analisis_metric" ||
      currentActionRole === "confirmacion_descarga_metric" ||
      currentActionRole === "confirmacion_ticket_pendiente_metric" ||
      currentActionRole === "confirmacion_peso_sap_metric" ||
      currentActionRole === "confirmacion_liberacion_sap_metric"
    ) {
      const clientInfo = await getClientInfo();
      const actionConfirm =
        currentActionRole === "confirmacion_analisis_metric"
          ? "calidad_confirma_test"
          : currentActionRole === "confirmacion_descarga_metric"
            ? "produccion_confirma_descarga"
            : currentActionRole === "confirmacion_ticket_pendiente_metric"
              ? "vigilancia_confirma_pendiente_ticket_peso"
              : currentActionRole === "confirmacion_peso_sap_metric"
                ? "logistica_confirma_pendiente_peso_en_sap"
                : currentActionRole === "confirmacion_liberacion_sap_metric"
                  ? "calidad_confima_liberacion_en_sap"
                  : "logistica_confirma_ingreso";

      return receptionProcessesService
        .notifyMetric({
          id: selectedProcessId,
          notifiedUserId: currentUser.id,
          actionConfirm,
          visibleAt: Date.now(),
          reactionTimeSec: 0,
          accionAt: new Date().toISOString(),
          systemDelaySec: 0,
          eventType: "ACTION_CLICKED_CONFIRM",
          metadata: JSON.stringify(clientInfo),
        })
        .then(() => {
          setIsLoadingConfirm(false);
          setOpenAuthDialog(false);
          setSelectedProcessId(null);
          Toast.success("Acción realizada con éxito.");
        });
    }

    const newState =
      currentActionRole === "autorizar" ? "autorizada" : "rechazada";

    const currentRole = currentUser.role;
    let actionRole = "";

    //TODO: Eliminar esto
    /* currentRole = [
      "LOGISTICA PENDIENTE DE AUTORIZACION",
      "LOGISTICA PENDIENTE DE CAPTURA PESO SAP",
    ].includes(currentStatus)
      ? ProcessEventRole.LOGISTICA
      : ["PRODUCCION PENDIENTE DE DESCARGA", "PRODUCCION DESCARGANDO"].includes(
            currentStatus,
          )
        ? ProcessEventRole.PRODUCCION
        : ProcessEventRole.CALIDAD; */
    //TODO: Eliminar esto

    switch (currentRole) {
      case ProcessEventRole.LOGISTICA:
        if (currentStatus === "LOGISTICA PENDIENTE DE AUTORIZACION") {
          actionRole =
            newState === "rechazada"
              ? "logistica-rechazo-ingreso"
              : "logistica-autorizo-ingreso";
        } else if (
          currentStatus === "LOGISTICA PENDIENTE DE CONFIRMACION INGRESO"
        ) {
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
      case ProcessEventRole.VIGILANCIA:
        if (currentStatus === "VIGILANCIA PENDIENTE DE ENTREGA DE TICKET") {
          actionRole = "ticket-entregado";
        }
        break;
    }

    receptionProcessesService
      .changeOfStatus({
        id: selectedProcessId,
        actionRole,
        ...(isRejectAction && { rejectionNotes: rejectionNotesTrimmed }),
      })
      .then(() => {
        setIsLoadingConfirm(false);
        setOpenAuthDialog(false);
        setSelectedProcessId(null);
        setRejectionNotes("");
        Toast.success("Acción realizada con éxito.");
      });
  };

  const handleCloseAuthDialog = () => {
    setOpenAuthDialog(false);
    setSelectedProcessId(null);
    setIsLoadingConfirm(false);
    setRejectionNotes("");
  };

  const getCurrentActionLabel = (actionRole: string) => {
    switch (actionRole) {
      case "descargando":
        return "descargar";
      case "descargado":
        return "marcar como descargado";
      case "ticket-entregado":
        return "notificar ticket entregado";
      case "confirmacion_ingreso_metric":
        return "confirmar pendiente de ingreso";
      case "confirmacion_analisis_metric":
        return "confirmar análisis";
      case "confirmacion_descarga_metric":
        return "confirmar descarga";
      case "confirmacion_ticket_pendiente_metric":
        return "confirmar ticket pendiente";
      case "confirmacion_peso_sap_metric":
        return "confirmar captura de peso en SAP";
      case "confirmacion_liberacion_sap_metric":
        return "confirmar liberación en SAP";
      case "captura-peso-sap":
        return "notificar captura de peso en SAP";
      case "liberar-sap":
        return "notificar liberación en SAP";
      case "autorizar":
        return "autorizar";
      default:
        return "rechazar";
    }
  };

  const calculateProgress = (events: EventData[]): number => {
    if (!events || events.length === 0) return 0;

    const eventCount = events.length;
    const maxEvents = 14;

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

            const currentStatusRaw =
              receptionProcess.events?.[receptionProcess.events.length - 1]
                ?.status;

            const formattedStatus = currentStatusRaw?.replace(/_/g, " ");
            const isRejectedStatus =
              formattedStatus?.toLowerCase().includes("rechazo") ?? false;

            const canAuthorize =
              formattedStatus?.endsWith("AUTORIZACION") &&
              currentUser?.role === ProcessEventRole.LOGISTICA; // TODO: Cambiar !=== por ===

            const canDecision =
              formattedStatus?.endsWith("PROCESANDO") &&
              currentUser?.role === ProcessEventRole.CALIDAD; // TODO: Cambiar !=== por ===

            const canDownload =
              formattedStatus?.endsWith("PENDIENTE DE DESCARGA") &&
              currentUser?.role === ProcessEventRole.PRODUCCION; // TODO: Cambiar !=== por ===

            const canEndDownload =
              formattedStatus?.endsWith("PRODUCCION DESCARGANDO") &&
              currentUser?.role === ProcessEventRole.PRODUCCION; // TODO: Cambiar !=== por ===

            const canNotifyTicketDelivered =
              currentStatusRaw ===
                "VIGILANCIA_PENDIENTE_DE_ENTREGA_DE_TICKET" &&
              currentUser?.role === ProcessEventRole.VIGILANCIA;

            const canCaptureWeight =
              formattedStatus?.endsWith(
                "LOGISTICA PENDIENTE DE CAPTURA PESO SAP",
              ) && currentUser?.role === ProcessEventRole.LOGISTICA; // TODO: Cambiar !=== por ===

            const canRelease =
              formattedStatus?.includes("PENDIENTE LIBERACION") &&
              currentUser?.role === ProcessEventRole.CALIDAD; // TODO: Cambiar !=== por ===

            const canRejectLogistica =
              currentStatusRaw === "LOGISTICA_PENDIENTE_DE_AUTORIZACION" &&
              currentUser?.role === ProcessEventRole.LOGISTICA;

            const canConfirmIngreso =
              currentStatusRaw ===
                "LOGISTICA_PENDIENTE_DE_CONFIRMACION_INGRESO" &&
              currentUser?.role === ProcessEventRole.LOGISTICA;

            const canConfirmAnalisis =
              currentStatusRaw ===
                "CALIDAD_PENDIENTE_DE_CONFIRMACION_DE_ANALISIS" &&
              currentUser?.role === ProcessEventRole.CALIDAD;

            const canConfirmDescarga =
              currentStatusRaw ===
                "PRODUCCION_PENDIENTE_DE_CONFIRMACION_PARA_DESCARGA" &&
              currentUser?.role === ProcessEventRole.PRODUCCION;

            const canConfirmTicketPendiente =
              currentStatusRaw ===
                "VIGILANCIA_PENDIENTE_DE_CONFIRMACION_TICKET_PESO" &&
              currentUser?.role === ProcessEventRole.VIGILANCIA;

            const canConfirmPesoSAP =
              currentStatusRaw ===
                "LOGISTICA_PENDIENTE_DE_CONFIRMACION_CAPTURA_PESO_SAP" &&
              currentUser?.role === ProcessEventRole.LOGISTICA;

            const canConfirmLiberacionSAP =
              currentStatusRaw ===
                "CALIDAD_PENDIENTE_DE_CONFIRMACION_LIBERACION_SAP" &&
              currentUser?.role === ProcessEventRole.CALIDAD;

            const hasActions =
              canAuthorize ||
              canDecision ||
              canDownload ||
              canEndDownload ||
              canNotifyTicketDelivered ||
              canCaptureWeight ||
              canRelease ||
              canConfirmIngreso ||
              canConfirmAnalisis ||
              canConfirmDescarga ||
              canConfirmTicketPendiente ||
              canConfirmPesoSAP ||
              canConfirmLiberacionSAP;

            const progressValue = formattedStatus?.includes("FINALIZO")
              ? 100
              : calculateProgress(receptionProcess.events);

            return (
              <Box
                key={receptionProcess.id}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isRejectedStatus
                    ? (theme.palette.errorTranslucent ??
                      "rgba(244, 67, 54, 0.12)")
                    : theme.surfaces.translucent,
                  border: `1px solid ${
                    isRejectedStatus
                      ? (theme.palette.error?.main ?? "rgba(244, 67, 54, 0.75)")
                      : theme.surfaces.border
                  }`,
                  overflow: "hidden",
                }}
                id={`reception-process-${receptionProcess.id}`}
              >
                <Box
                  component="div"
                  role="button"
                  tabIndex={0}
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
                    "&:focus-visible": {
                      outline: `2px solid ${theme.forms.borderFocus}`,
                      outlineOffset: 2,
                    },
                  }}
                  onClick={() => toggleExpanded(receptionProcess.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleExpanded(receptionProcess.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-controls={`reception-process-${receptionProcess.id}`}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "minmax(170px, 1.4fr) minmax(120px, 0.9fr) minmax(240px, 2fr) minmax(130px, 1fr) minmax(70px, 0.5fr)",
                      },
                      gap: { xs: 1.5, sm: 1.5 },
                      alignItems: "start",
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
                        Proveedor / placas
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.textPrimary,
                          lineHeight: 1.4,
                        }}
                      >
                        {receptionProcess.providerName ?? "Sin proveedor"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.textSecondary,
                          display: "block",
                          mt: 0.25,
                          lineHeight: 1.3,
                        }}
                      >
                        {receptionProcess.licensePlates ?? "Sin placas"}
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
                        {formattedStatus ?? "Sin eventos"}
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
                        width: "100%",
                        justifyContent: {
                          xs: "space-between",
                          sm: "flex-end",
                        },
                        textAlign: { sm: "right" },
                      }}
                    >
                      <Typography
                        variant="inherit"
                        sx={{
                          color: theme.palette.textSecondary,
                          fontSize: "1.5rem",
                        }}
                      >
                        # {receptionProcess.id}
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
                      {!formattedStatus.includes("FINALIZO") && (
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
                      )}

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
                          {(canDecision || canRejectLogistica) && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "rechazar",
                                  formattedStatus,
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
                          {canConfirmIngreso && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_ingreso_metric",
                                  formattedStatus,
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
                              Confirmación pentiende de ingreso
                            </Button>
                          )}
                          {canConfirmAnalisis && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_analisis_metric",
                                  formattedStatus,
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
                              Confirmación pendiente de análisis
                            </Button>
                          )}
                          {canConfirmDescarga && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_descarga_metric",
                                  formattedStatus,
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
                              Confirmación pendiente de descarga
                            </Button>
                          )}
                          {canConfirmTicketPendiente && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_ticket_pendiente_metric",
                                  formattedStatus,
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
                              Confirmación pendiente de ticket de peso
                            </Button>
                          )}
                          {canConfirmPesoSAP && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_peso_sap_metric",
                                  formattedStatus,
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
                              Confirmación pendiente de captura de peso en SAP
                            </Button>
                          )}
                          {canConfirmLiberacionSAP && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "confirmacion_liberacion_sap_metric",
                                  formattedStatus,
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
                              Confirmación pendiente de liberación en SAP
                            </Button>
                          )}
                          {(canAuthorize || canDecision) && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "autorizar",
                                  formattedStatus,
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
                                  formattedStatus,
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
                                  formattedStatus,
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
                          {canNotifyTicketDelivered && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "ticket-entregado",
                                  formattedStatus,
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
                              Notificar ticket entregado
                            </Button>
                          )}
                          {canCaptureWeight && (
                            <Button
                              onClick={(e) =>
                                handleAuthorize(
                                  e,
                                  receptionProcess.id,
                                  "captura-peso-sap",
                                  formattedStatus,
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
                                  formattedStatus,
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

                      <TimeLineEvents
                        receptionProcess={receptionProcess}
                        currentStatus={currentStatusRaw}
                      />
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
          <b>{getCurrentActionLabel(currentActionRole)}</b> esta operación? Esta
          acción no puede ser revertida.
          {currentActionRole === "rechazar" && (
            <TextField
              multiline
              minRows={3}
              fullWidth
              required
              label="Motivo de rechazo (Obligatorio)"
              placeholder="Describe el motivo del rechazo"
              value={rejectionNotes}
              onChange={(event) => setRejectionNotes(event.target.value)}
              sx={{
                mt: 2,
                "& .MuiInputLabel-root": {
                  color:
                    theme.name === "dark"
                      ? "rgba(255, 255, 255, 0.82)"
                      : theme.palette.textSecondary,
                },
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.textPrimary,
                  backgroundColor:
                    theme.name === "dark"
                      ? "rgba(255, 255, 255, 0.04)"
                      : theme.forms.fieldBackground,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    theme.name === "dark"
                      ? "rgba(255, 255, 255, 0.32)"
                      : theme.surfaces.border,
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      theme.name === "dark"
                        ? "rgba(255, 255, 255, 0.5)"
                        : theme.forms.borderHover,
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      theme.name === "dark"
                        ? "rgba(255, 255, 255, 0.78)"
                        : theme.forms.borderFocus,
                    borderWidth: 2,
                  },
              }}
            />
          )}
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
            disabled={
              isLoadingConfirm ||
              (currentActionRole === "rechazar" && !rejectionNotes.trim())
            }
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
