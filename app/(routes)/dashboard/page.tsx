"use client";

import { Space_Grotesk } from "next/font/google";
import TimelineIcon from "@mui/icons-material/Timeline";
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

const DashboardPage = () => {
  return (
    <Box
      className={spaceGrotesk.className}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #040a1c, #0f2557 38%, #17507b)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 8 },
        position: "relative",
        overflow: "hidden",
        "::before": {
          content: '""',
          position: "absolute",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(73,118,255,0.42), transparent 60%)",
          top: -200,
          left: -120,
          filter: "blur(18px)",
        },
        "::after": {
          content: '""',
          position: "absolute",
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle, rgba(7,181,159,0.55), transparent 65%)",
          bottom: -90,
          right: -120,
          filter: "blur(16px)",
        },
      }}
    >
      <Box
        sx={{ position: "relative", width: "100%", maxWidth: 1280, zIndex: 1 }}
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
              <Typography variant="body1" sx={{ color: "#fff" }}>
                Seguimiento en tiempo real de flota, recursos y alertas críticas
                para tu terminal.
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
                  background: "linear-gradient(90deg, #1c6fe8, #23a6d9)",
                  color: "#fff",
                }}
              >
                Monitor en tiempo real
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
                    background: "rgba(7,11,32,0.72)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 25px 65px rgba(2,7,21,0.4)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: "rgba(33,150,243,0.12)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <stat.icon fontSize="medium" sx={{ color: "#fff" }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, color: "#fff" }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#fff" }}>
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
                background: "rgba(7,11,32,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 30px 80px rgba(2,7,21,0.5)",
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
                    sx={{ fontWeight: 600, color: "#fff" }}
                  >
                    Operaciones de hoy
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Seguimiento de buques y estado de atraque
                  </Typography>
                </Box>
                <Chip
                  label="Tiempo real"
                  color="primary"
                  sx={{
                    backgroundColor: "rgba(33,150,243,0.2)",
                    color: "#fff",
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
                      backgroundColor: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#fff" }}
                      >
                        {op.vessel}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#fff" }}>
                        {op.status}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: "#fff" }}>
                        ETA
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#fff" }}>
                        {op.eta}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: "#fff" }}>
                        Muelle
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#fff" }}>
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
                        backgroundColor: "rgba(255,255,255,0.12)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          background:
                            "linear-gradient(90deg, #1c6fe8, #23a6d9)",
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
                  background: "rgba(7,11,32,0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#fff" }}
                  mb={1.5}
                >
                  Alertas prioritarias
                </Typography>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
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
                          sx={{ fontWeight: 600, color: "#fff" }}
                        >
                          {alert.title}
                        </Typography>
                        <Chip
                          label={alert.severity}
                          size="small"
                          sx={{
                            backgroundColor:
                              alert.severity === "Alta"
                                ? "rgba(239,83,80,0.25)"
                                : alert.severity === "Media"
                                  ? "rgba(255,167,38,0.2)"
                                  : "rgba(76,175,80,0.2)",
                            color: "#fff",
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
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
                  background: "rgba(7,11,32,0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#fff" }}
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
                            bgcolor: "rgba(33,150,243,0.28)",
                            color: "#fff",
                          }}
                        >
                          {member[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member}
                        primaryTypographyProps={{
                          sx: { color: "#fff" },
                        }}
                        secondary={`Rol ${index === 0 ? "Control tráfico" : index === 1 ? "Patio" : index === 2 ? "Seguridad" : "Operaciones"}`}
                        secondaryTypographyProps={{
                          color: "#fff",
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
  );
};

export default DashboardPage;
