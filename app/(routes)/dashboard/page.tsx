"use client";

import { useEffect, useState } from "react";

import SailingIcon from "@mui/icons-material/Sailing";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
  Box,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import RealTimeMonitor from "./components/RealTimeMonitor";
import ConnectedUsers from "./components/ConnectedUsers";
import { useThemeConfig } from "@/theme/ThemeProvider";
import MainBanner from "./components/MainBanner";

const stats = [
  {
    label: "Arribos programados",
    value: "18 buques",
    delta: "+3 respecto ayer",
    icon: SailingIcon,
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

const operations = [
  {
    vessel: "MV Aurora Spirit",
    eta: "09:20",
    berth: "Muelle 3",
    status: "En fondeo",
  },
  {
    vessel: "MSC Lima",
    eta: "11:45",
    berth: "Muelle 5",
    status: "En aproximación",
  },
  {
    vessel: "Pacific Star",
    eta: "13:30",
    berth: "Muelle 2",
    status: "Amarrado",
  },
  {
    vessel: "Atlas Explorer",
    eta: "17:05",
    berth: "Muelle 1",
    status: "Zarpando",
  },
];

const alerts = [
  {
    title: "Inspección de seguridad",
    detail: "Equipo RTG-14 requiere check eléctrico",
    severity: "Alta",
  },
  {
    title: "Demora en patio",
    detail: "Bloque C supera window de 90 min",
    severity: "Media",
  },
  {
    title: "Tripulación sin credencial",
    detail: "4 accesos pendientes de validar",
    severity: "Baja",
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
];

const DashboardPage = () => {
  const { theme } = useThemeConfig();
  const [realTimeMonitor, setRealTimeMonitor] = useState(false);

  const severityColor = (level: string) => {
    if (level === "Alta") return theme.chips.high;
    if (level === "Media") return theme.chips.medium;
    return theme.chips.low;
  };

  useEffect(() => {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "PIPA_NOTIFICATION") {
        const payload = event.data.data;

        // actualizar estado, router, modal, etc.
        console.log("Pipa desde notificación", payload);
      }
    });
  }, []);

  return (
    <>
      {realTimeMonitor && (
        <RealTimeMonitor handleClose={() => setRealTimeMonitor(false)} />
      )}
      <Stack spacing={4}>
        <MainBanner setRealTimeMonitor={setRealTimeMonitor} />

        <Stack spacing={2}>
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
        </Stack>

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
        </Paper>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
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
              {operations.map((op) => (
                <Box
                  key={op.vessel}
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
                      {op.vessel}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.textSecondary }}
                    >
                      {op.status}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: theme.palette.textSecondary }}
                    >
                      ETA
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.textPrimary }}
                    >
                      {op.eta}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: theme.palette.textSecondary }}
                    >
                      Muelle
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.textPrimary }}
                    >
                      {op.berth}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      op.status === "Amarrado"
                        ? 100
                        : op.status === "Zarpando"
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
              ))}
            </Stack>
          </Paper>

          <Stack spacing={3} sx={{ width: { xs: "100%", lg: 360 } }}>
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

            <ConnectedUsers />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default DashboardPage;
