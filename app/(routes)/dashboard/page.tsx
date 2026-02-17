"use client";

import { useEffect, useState } from "react";

//import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
//import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { Stack } from "@mui/material";
//import PendingActionsIcon from "@mui/icons-material/PendingActions";
//import LocalShippingIcon from "@mui/icons-material/LocalShipping";
//import InventoryIcon from "@mui/icons-material/Inventory";

import ReceptionProcessTable from "./components/ReceptionProcessTable";
import PipaIngresoDialog from "./components/PipaIngresoDialog";
import RealTimeMonitor from "./components/RealTimeMonitor";
import ConnectedUsers from "./components/ConnectedUsers";
//import { useThemeConfig } from "@/theme/ThemeProvider";
import { receptionProcessesService } from "@/services";
import AlertsEvents from "./components/AlertsEvents";
import { useSocket } from "@/common/SocketProvider";
import MainBanner from "./components/MainBanner";
import { ReceptionProcess } from "@/types";
import { Toast } from "@/utils";

/* const stats = [
  {
    label: "Arribos programados",
    value: "3 pipas",
    delta: "+3 respecto ayer",
    icon: LocalShippingIcon,
  },
  {
    label: "Volúmenes operados",
    value: "42.7k TEU",
    delta: "+12%",
    icon: InventoryIcon,
  },
  {
    label: "SLAs cumplidos",
    value: "96.4%",
    delta: "Meta 94%",
    icon: CheckCircleOutlineIcon,
  },
  {
    label: "Intervenciones en curso",
    value: "5 equipos",
    delta: "2 críticos",
    icon: PendingActionsIcon,
  },
];

const trendSeries = [
  {
    label: "Arribos",
    value: "18 buques",
    change: "+3 vs ayer",
    series: [32, 38, 42, 36, 52, 58, 64],
  },
  {
    label: "TEU",
    value: "42.7k",
    change: "+12% semanal",
    series: [44, 48, 52, 60, 66, 62, 70],
  },
  {
    label: "SLAs",
    value: "96.4%",
    change: "+1.2pp",
    series: [68, 72, 74, 78, 80, 86, 90],
  },
  {
    label: "Interv.",
    value: "5 equipos",
    change: "2 criticos",
    series: [40, 36, 44, 52, 48, 56, 50],
  },
]; */

const DashboardPage = () => {
  //const { theme } = useThemeConfig();
  const [realTimeMonitor, setRealTimeMonitor] = useState(false);
  const [isPipaDialogOpen, setIsPipaDialogOpen] = useState(false);
  const [isPipaSubmitting, setIsPipaSubmitting] = useState(false);
  const [pipaMaterialType, setPipaMaterialType] = useState("");
  const [receptionProcess, setReceptionProcess] =
    useState<ReceptionProcess | null>(null);

  const { socket } = useSocket();

  /*  useEffect(() => {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "confirm-clicked") {
        const payload = event.data.data;

        setRealTimeMonitor(true);

        // actualizar estado, router, modal, etc.
        console.log("Pipa desde notificación", payload);
      }
    });
  }, []); */

  const handleOpenPipaDialog = () => {
    setIsPipaDialogOpen(true);
  };

  const handleClosePipaDialog = () => {
    if (isPipaSubmitting) return;
    setPipaMaterialType("");
    setIsPipaDialogOpen(false);
  };

  const handleConfirmPipaIngreso = async () => {
    if (isPipaSubmitting) return;
    setIsPipaSubmitting(true);

    try {
      await receptionProcessesService.create({
        typeOfMaterial: pipaMaterialType,
      });
      Toast.success("Ingreso de pipa registrado.");
      setPipaMaterialType("");
      setIsPipaDialogOpen(false);
    } finally {
      setIsPipaSubmitting(false);
    }
  };

  useEffect(() => {
    if (!socket) return undefined;

    const handleSessionsReady = (payload: ReceptionProcess) => {
      const currentId = payload.id;

      if (currentId === receptionProcess?.id) {
        setReceptionProcess(payload);
      }
    };

    socket.on("reception-process:status_update", handleSessionsReady);

    return () => {
      socket.off("reception-process:status_update", handleSessionsReady);
    };
  }, [socket, receptionProcess]);

  return (
    <>
      {realTimeMonitor && receptionProcess && (
        <RealTimeMonitor
          handleClose={() => {
            setRealTimeMonitor(false);
            setReceptionProcess(null);
          }}
          receptionProcess={receptionProcess}
        />
      )}
      <PipaIngresoDialog
        open={isPipaDialogOpen}
        isSubmitting={isPipaSubmitting}
        materialType={pipaMaterialType}
        onClose={handleClosePipaDialog}
        onConfirm={handleConfirmPipaIngreso}
        onMaterialTypeChange={setPipaMaterialType}
      />
      <Stack spacing={4}>
        <MainBanner
          setRealTimeMonitor={setRealTimeMonitor}
          onPipaIngreso={handleOpenPipaDialog}
        />

        {/* <Stack spacing={2}>
          <Typography variant="overline" sx={{ letterSpacing: 3 }}>
            Resumen operativo
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
                key={stat.label}
              >
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: theme.surfaces.card,
                    border: `1px solid ${theme.surfaces.border}`,
                    boxShadow: theme.overlays.cardShadow,
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.overlays.panelShadow,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: theme.surfaces.iconBox,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <stat.icon
                        fontSize="medium"
                        sx={{ color: theme.palette.textPrimary }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.textPrimary,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.delta}
                        size="small"
                        sx={{
                          mt: 0.8,
                          backgroundColor: theme.surfaces.translucent,
                          color: theme.palette.textPrimary,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack> */}

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <ReceptionProcessTable
            selectReceptionProcess={(
              currentReceptionProcess: ReceptionProcess,
            ) => {
              setReceptionProcess(currentReceptionProcess);
              setRealTimeMonitor(true);
            }}
          />

          <Stack spacing={3} sx={{ width: { xs: "100%", lg: 360 } }}>
            <AlertsEvents />
            <ConnectedUsers />
          </Stack>
        </Stack>

        {/* <Paper
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
            mb={3}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, color: theme.palette.textSecondary }}
              >
                Tendencias
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
              >
                Ritmo operativo - ultimos 7 dias
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.textSecondary }}
              >
                Indicadores clave con variacion semanal.
              </Typography>
            </Box>
            <Chip
              label="Actualizado hace 2 min"
              size="small"
              sx={{
                backgroundColor: theme.surfaces.translucent,
                color: theme.palette.textPrimary,
                fontWeight: 600,
              }}
            />
          </Stack>
          <Grid container spacing={2.5}>
            {trendSeries.map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: theme.surfaces.card,
                    border: `1px solid ${theme.surfaces.border}`,
                    boxShadow: theme.overlays.cardShadow,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        {item.label}
                      </Typography>
                      <Chip
                        label={item.change}
                        size="small"
                        sx={{
                          backgroundColor: theme.surfaces.translucent,
                          color: theme.palette.textPrimary,
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                    >
                      {item.value}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gap: 0.7,
                        alignItems: "end",
                        height: 48,
                      }}
                    >
                      {item.series.map((point, index) => (
                        <Box
                          key={`${item.label}-${index}`}
                          sx={{
                            width: 6,
                            height: `${point}%`,
                            borderRadius: 999,
                            background: theme.gradients.progress,
                            opacity: index === item.series.length - 1 ? 1 : 0.6,
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper> */}
      </Stack>
    </>
  );
};

export default DashboardPage;
