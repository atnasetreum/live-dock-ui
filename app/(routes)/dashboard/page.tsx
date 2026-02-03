"use client";

import { useState } from "react";

import { Space_Grotesk } from "next/font/google";
import TimelineIcon from "@mui/icons-material/Timeline";
import LogoutIcon from "@mui/icons-material/Logout";
import SailingIcon from "@mui/icons-material/Sailing";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useThemeConfig } from "../../theme/ThemeProvider";
import type { GlowLayer } from "../../theme/tokens";
import RealTimeMonitor from "./components/RealTimeMonitor";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

const glowLayerStyles = (layer: GlowLayer) => ({
  content: '""',
  position: "absolute" as const,
  width: layer.width,
  height: layer.height,
  top: layer.top,
  left: layer.left,
  right: layer.right,
  bottom: layer.bottom,
  background: layer.gradient,
  filter: `blur(${layer.blur}px)`,
});

const DashboardPage = () => {
  const { theme } = useThemeConfig();
  const [realTimeMonitor, setRealTimeMonitor] = useState(false);

  const severityColor = (level: string) => {
    if (level === "Alta") return theme.chips.high;
    if (level === "Media") return theme.chips.medium;
    return theme.chips.low;
  };

  const roles = ["Control tráfico", "Patio", "Seguridad", "Operaciones"];

  return (
    <>
      {realTimeMonitor && (
        <RealTimeMonitor handleClose={() => setRealTimeMonitor(false)} />
      )}
      <Box
        className={spaceGrotesk.className}
        sx={{
          minHeight: "100vh",
          background: theme.palette.pageBackground,
          color: theme.palette.textPrimary,
          display: "flex",
          justifyContent: "center",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 8 },
          position: "relative",
          overflow: "hidden",
          "::before": glowLayerStyles(theme.glows.primary),
          "::after": glowLayerStyles(theme.glows.secondary),
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 1280,
            zIndex: 1,
          }}
        >
          <Stack spacing={4}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 4 }}>
                  PANEL OPERATIVO
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 600, lineHeight: 1.1 }}
                >
                  Bienvenido a LiveDock Control
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.textSecondary }}
                >
                  Seguimiento en tiempo real de flota, recursos y alertas
                  críticas para tu terminal.
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
                    window.location.href = "/";
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
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
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.textSecondary }}
                        >
                          {stat.delta}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

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
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
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
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(140px, 1fr))",
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
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
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
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                    mb={2}
                  >
                    Equipo en turno
                  </Typography>
                  <List disablePadding>
                    {[
                      "Lucía Torres",
                      "Carlos Méndez",
                      "Andrea Ríos",
                      "Kenji Nakamura",
                    ].map((member, index) => (
                      <ListItem key={member} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: theme.avatarBackground,
                              color: theme.palette.textPrimary,
                            }}
                          >
                            {member[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member}
                          primaryTypographyProps={{
                            sx: { color: theme.palette.textPrimary },
                          }}
                          secondary={`Rol ${roles[index] || roles[roles.length - 1]}`}
                          secondaryTypographyProps={{
                            sx: { color: theme.listSecondary },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;
