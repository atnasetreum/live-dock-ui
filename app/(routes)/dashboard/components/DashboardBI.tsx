"use client";

import { useMemo } from "react";

import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InsightsIcon from "@mui/icons-material/Insights";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SpeedIcon from "@mui/icons-material/Speed";
import TimelineIcon from "@mui/icons-material/Timeline";

import { useThemeConfig } from "@/theme/ThemeProvider";

const kpiCards = [
  {
    label: "Pipas en descarga",
    value: "12",
    delta: "+2 vs turno anterior",
    trend: 72,
    accent: "info",
  },
  {
    label: "Tiempo promedio",
    value: "42 min",
    delta: "-6% vs semana",
    trend: 58,
    accent: "success",
  },
  {
    label: "Eficiencia operativa",
    value: "91%",
    delta: "+3% vs objetivo",
    trend: 84,
    accent: "primary",
  },
  {
    label: "Incidencias abiertas",
    value: "3",
    delta: "-1 en 24h",
    trend: 36,
    accent: "warning",
  },
];

const liveLoads = [
  {
    id: "P-2041",
    material: "Alcohol",
    bay: "B6",
    eta: "14 min",
    progress: 72,
    status: "Descargando",
  },
  {
    id: "P-1977",
    material: "Agua",
    bay: "A2",
    eta: "22 min",
    progress: 48,
    status: "En espera",
  },
  {
    id: "P-2112",
    material: "Less",
    bay: "C1",
    eta: "9 min",
    progress: 86,
    status: "Finalizando",
  },
];

const efficiencyRows = [
  { label: "Rampas activas", value: 88 },
  { label: "Cumplimiento SLA", value: 93 },
  { label: "Balance de turnos", value: 79 },
];

const avgTimes = [
  { label: "Ingreso a caseta", value: "6 min" },
  { label: "Autorizacion", value: "12 min" },
  { label: "Descarga", value: "21 min" },
  { label: "Liberacion SAP", value: "9 min" },
];

const historicalRows = [
  {
    id: "FEB-2041",
    material: "Alcohol",
    turns: "Noche",
    volume: "32k L",
    time: "46 min",
    status: "Finalizado",
  },
  {
    id: "FEB-1987",
    material: "Agua",
    turns: "Tarde",
    volume: "28k L",
    time: "39 min",
    status: "Finalizado",
  },
  {
    id: "FEB-1762",
    material: "Colgate",
    turns: "Manana",
    volume: "30k L",
    time: "52 min",
    status: "Con incidencias",
  },
  {
    id: "FEB-1558",
    material: "Less",
    turns: "Tarde",
    volume: "27k L",
    time: "41 min",
    status: "Finalizado",
  },
];

type DashboardBIProps = {
  onClose?: () => void;
};

const DashboardBI = ({ onClose }: DashboardBIProps) => {
  const { theme } = useThemeConfig();
  const chartBars = useMemo(
    () => [42, 56, 48, 68, 74, 62, 81, 72, 90, 76, 84, 96],
    [],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2.5, md: 3.5 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          background: theme.surfaces.panel,
          border: `1px solid ${theme.surfaces.border}`,
          boxShadow: theme.overlays.panelShadow,
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<InsightsIcon />}
                  label="Monitoreo BI"
                  size="small"
                  sx={{
                    backgroundColor: theme.surfaces.translucent,
                    color: theme.palette.textPrimary,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Actualizado hace 2 min"
                  size="small"
                  aria-live="polite"
                  sx={{
                    backgroundColor: theme.chips.realTime,
                    color: theme.palette.textPrimary,
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.textPrimary,
                  textWrap: "balance",
                }}
              >
                Descarga de Pipas en Tiempo Real
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.textSecondary, maxWidth: 520 }}
              >
                Panel unificado para analisis operativo, tendencias y
                rendimiento historico en planta industrial.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction="column"
              spacing={1.5}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
              alignItems={{ xs: "stretch", md: "flex-end" }}
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  width: { xs: "100%", md: 220 },
                  backgroundImage: theme.gradients.primary,
                  color: theme.buttons.containedText,
                  boxShadow: theme.overlays.cardShadow,
                }}
              >
                Exportar reporte
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterAltIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  width: { xs: "100%", md: 220 },
                  borderColor: theme.buttons.outlinedColor,
                  color: theme.buttons.outlinedColor,
                }}
              >
                Configurar filtros
              </Button>
              {onClose && (
                <Button
                  variant="outlined"
                  onClick={onClose}
                  startIcon={<CloseIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 44,
                    width: { xs: "100%", md: 220 },
                    borderColor: theme.buttons.outlinedColor,
                    color: theme.buttons.outlinedColor,
                  }}
                >
                  Cerrar dashboard
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          background: theme.surfaces.panel,
          border: `1px solid ${theme.surfaces.border}`,
          boxShadow: theme.overlays.panelShadow,
        }}
      >
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Fecha"
              name="dateRange"
              fullWidth
              size="small"
              autoComplete="off"
              placeholder="Ej: 10-16 FEB"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="shift-label">Turno</InputLabel>
              <Select
                labelId="shift-label"
                name="shift"
                label="Turno"
                defaultValue="todos"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="manana">Manana</MenuItem>
                <MenuItem value="tarde">Tarde</MenuItem>
                <MenuItem value="noche">Noche</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="material-label">Material</InputLabel>
              <Select
                labelId="material-label"
                name="material"
                label="Material"
                defaultValue="todos"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="alcohol">Alcohol</MenuItem>
                <MenuItem value="agua">Agua</MenuItem>
                <MenuItem value="less">Less</MenuItem>
                <MenuItem value="colgate">Colgate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Buscar"
              name="search"
              fullWidth
              size="small"
              autoComplete="off"
              placeholder="ID, operador, rampa"
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {kpiCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 4,
                background: theme.surfaces.card,
                border: `1px solid ${theme.surfaces.border}`,
                boxShadow: theme.overlays.cardShadow,
                height: "100%",
              }}
            >
              <Stack spacing={1.25}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 2.4,
                    color: theme.palette.textSecondary,
                  }}
                >
                  {card.label}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.textPrimary,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.textSecondary }}
                  >
                    {card.delta}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={card.trend}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: theme.surfaces.translucent,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background:
                        card.accent === "warning"
                          ? theme.palette.warning?.main
                          : card.accent === "info"
                            ? theme.palette.info?.main
                            : card.accent === "success"
                              ? theme.palette.success?.main
                              : theme.palette.primary?.main,
                    },
                  }}
                />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              background: theme.surfaces.panel,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="overline" sx={{ letterSpacing: 2.4 }}>
                    Tendencias
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    Volumen descargado por hora
                  </Typography>
                </Stack>
                <Chip
                  label="Ultimas 24h"
                  size="small"
                  sx={{
                    backgroundColor: theme.surfaces.translucent,
                    color: theme.palette.textSecondary,
                  }}
                />
              </Stack>
              <Box
                sx={{
                  height: 220,
                  borderRadius: 3,
                  background: theme.surfaces.translucent,
                  border: `1px solid ${theme.surfaces.border}`,
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: `repeat(${chartBars.length}, 1fr)`,
                  alignItems: "end",
                  gap: 1,
                }}
              >
                {chartBars.map((value, index) => (
                  <Box
                    key={`bar-${index}`}
                    sx={{
                      height: `${value}%`,
                      borderRadius: 999,
                      background: theme.gradients.primary,
                      opacity: index % 2 === 0 ? 0.85 : 1,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </Box>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Stack spacing={0.5} sx={{ minWidth: 140 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.textSecondary }}
                  >
                    Pico del dia
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    09:40 - 96%
                  </Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ minWidth: 140 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.textSecondary }}
                  >
                    Variacion semanal
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    +8.4%
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                background: theme.surfaces.panel,
                border: `1px solid ${theme.surfaces.border}`,
                boxShadow: theme.overlays.panelShadow,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SpeedIcon sx={{ color: theme.palette.textPrimary }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    Eficiencia operativa
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {efficiencyRows.map((row) => (
                    <Stack key={row.label} spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.textSecondary }}
                        >
                          {row.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.textPrimary }}
                        >
                          {row.value}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={row.value}
                        sx={{
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: theme.surfaces.translucent,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            background: theme.gradients.primary,
                          },
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                background: theme.surfaces.panel,
                border: `1px solid ${theme.surfaces.border}`,
                boxShadow: theme.overlays.panelShadow,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TimelineIcon sx={{ color: theme.palette.textPrimary }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    Tiempos promedio
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {avgTimes.map((row) => (
                    <Stack
                      key={row.label}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.textSecondary }}
                      >
                        {row.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.textPrimary,
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              background: theme.surfaces.panel,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShippingIcon sx={{ color: theme.palette.textPrimary }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                >
                  Descargas activas
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {liveLoads.map((load) => (
                  <Paper
                    key={load.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      borderColor: theme.surfaces.border,
                      background: theme.surfaces.translucent,
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.textPrimary,
                            }}
                          >
                            {load.id} - {load.material}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            Rampa {load.bay} • ETA {load.eta}
                          </Typography>
                        </Stack>
                        <Chip
                          label={load.status}
                          size="small"
                          sx={{
                            backgroundColor: theme.surfaces.panel,
                            color: theme.palette.textPrimary,
                            border: `1px solid ${theme.surfaces.border}`,
                          }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={load.progress}
                        sx={{
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: theme.surfaces.panel,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            background: theme.gradients.primary,
                          },
                        }}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              background: theme.surfaces.panel,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <ArrowOutwardIcon sx={{ color: theme.palette.textPrimary }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
                  >
                    Reporte historico
                  </Typography>
                </Stack>
                <Chip
                  label="Filtros avanzados"
                  size="small"
                  sx={{
                    backgroundColor: theme.surfaces.translucent,
                    color: theme.palette.textSecondary,
                  }}
                />
              </Stack>
              <Divider sx={{ borderColor: theme.surfaces.border }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Material</TableCell>
                      <TableCell>Turno</TableCell>
                      <TableCell>Volumen</TableCell>
                      <TableCell>Tiempo</TableCell>
                      <TableCell>Estatus</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historicalRows.length ? (
                      historicalRows.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.material}</TableCell>
                          <TableCell>{row.turns}</TableCell>
                          <TableCell>{row.volume}</TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              sx={{
                                backgroundColor:
                                  row.status === "Con incidencias"
                                    ? theme.palette.warning?.main
                                    : theme.surfaces.translucent,
                                color:
                                  row.status === "Con incidencias"
                                    ? theme.buttons.containedText
                                    : theme.palette.textSecondary,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            Sin reportes historicos para el periodo.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardBI;
