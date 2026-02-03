import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { useThemeConfig } from "../../../theme/ThemeProvider";
import type { ThemePreference } from "../../../theme/tokens";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const COLUMN_COUNT = 7;

const laneConfig = [
  { id: "supplier", label: "Proveedor", accent: "#101828" },
  { id: "security", label: "Vigilancia", accent: "#1d4ed8" },
  { id: "logistics", label: "Logística", accent: "#f97316" },
  { id: "production", label: "Producción", accent: "#16a34a" },
  { id: "quality", label: "Calidad", accent: "#0ea5e9" },
] as const;

type LaneId = (typeof laneConfig)[number]["id"];

type StepNode = {
  id: string;
  lane: LaneId;
  column: number;
  span?: number;
  title?: string;
  subtitle?: string;
  kind?: "box" | "circle" | "diamond";
  circleLabel?: string;
  emphasis?: "solid" | "outlined";
};

const workflowNodes: StepNode[] = [
  {
    id: "start",
    lane: "supplier",
    column: 1,
    kind: "circle",
    circleLabel: "I",
  },
  {
    id: "supplier-arrival",
    lane: "supplier",
    column: 2,
    title: "Se presenta en caseta 2",
  },
  {
    id: "security-docs",
    lane: "security",
    column: 2,
    span: 2,
    title: "Revisa documentos, cumplimiento SST",
    subtitle: "Entrega tickets de pesaje",
  },
  {
    id: "supplier-weigh-in",
    lane: "supplier",
    column: 3,
    title: "Realiza pesaje y llena los datos del ticket",
  },
  {
    id: "security-entry",
    lane: "security",
    column: 3,
    title: "Permite ingreso seguro",
  },
  {
    id: "logistics-intake",
    lane: "logistics",
    column: 3,
    title: "Verifica datos y da ingreso a descarga",
  },
  {
    id: "production-purge",
    lane: "production",
    column: 3,
    title: "En conjunto con Calidad realiza purga",
  },
  {
    id: "quality-sample",
    lane: "quality",
    column: 3,
    title: "Toma muestra y verifica estado de las mangueras",
  },
  {
    id: "quality-decision",
    lane: "quality",
    column: 4,
    kind: "diamond",
    title: "OK",
  },
  {
    id: "quality-not-ok",
    lane: "quality",
    column: 5,
    title: "Informa a producción, proveedor, compras y logística",
    subtitle: "Si el resultado no es OK",
    emphasis: "outlined",
  },
  {
    id: "production-discharge",
    lane: "production",
    column: 4,
    title: "Realiza descarga segura",
  },
  {
    id: "logistics-proof",
    lane: "logistics",
    column: 4,
    title: "Recibe evidencia de descarga",
  },
  {
    id: "security-exit",
    lane: "security",
    column: 4,
    title: "Procesa la salida segura del proveedor",
  },
  {
    id: "supplier-weigh-out",
    lane: "supplier",
    column: 5,
    title: "Realiza pesaje y llena los datos del ticket",
  },
  {
    id: "security-allow-exit",
    lane: "security",
    column: 5,
    title: "Permite salida segura",
  },
  {
    id: "security-access",
    lane: "security",
    column: 6,
    title: "Permite acceso peatonal",
  },
  {
    id: "supplier-ticket",
    lane: "supplier",
    column: 6,
    title: "Entrega pesaje a logística para des tara",
  },
  {
    id: "logistics-sap",
    lane: "logistics",
    column: 6,
    title: "Captura peso en SAP para su ingreso",
  },
  {
    id: "production-ready",
    lane: "production",
    column: 6,
    title: "Puede hacer uso del alcohol",
  },
  {
    id: "quality-release",
    lane: "quality",
    column: 6,
    title: "Realiza liberación en SAP",
  },
  {
    id: "end-supplier",
    lane: "supplier",
    column: 7,
    kind: "circle",
    circleLabel: "F",
  },
  {
    id: "end-production",
    lane: "production",
    column: 7,
    kind: "circle",
    circleLabel: "F",
  },
];

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

const columnTemplate = `repeat(${COLUMN_COUNT}, minmax(160px, 1fr))`;

const StepCard = ({
  step,
  accent,
  surface,
  border,
  shadow,
  textPrimary,
  textSecondary,
}: {
  step: StepNode;
  accent: string;
  surface: string;
  border: string;
  shadow: string;
  textPrimary: string;
  textSecondary: string;
}) => {
  const baseStyles = {
    gridColumn: `${step.column} / span ${step.span ?? 1}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  } as const;

  if (step.kind === "circle") {
    return (
      <Box sx={baseStyles}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: accent,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: shadow,
          }}
        >
          {step.circleLabel}
        </Box>
      </Box>
    );
  }

  if (step.kind === "diamond") {
    return (
      <Box sx={baseStyles}>
        <Box
          sx={{
            width: 120,
            height: 120,
            backgroundColor: surface,
            border: `2px solid ${accent}`,
            color: textPrimary,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {step.title}
        </Box>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        ...baseStyles,
        p: 2,
        minHeight: 110,
        borderRadius: 3,
        border: `1px solid ${step.emphasis === "outlined" ? accent : border}`,
        backgroundColor: step.emphasis === "outlined" ? "transparent" : surface,
        color: textPrimary,
        boxShadow: step.emphasis === "outlined" ? "none" : shadow,
      }}
    >
      <Stack spacing={0.75} alignItems="center" textAlign="center">
        {step.title && (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {step.title}
          </Typography>
        )}
        {step.subtitle && (
          <Typography variant="caption" sx={{ color: textSecondary }}>
            {step.subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const RealTimeMonitor = ({ handleClose }: { handleClose: () => void }) => {
  const { theme, preference, setPreference } = useThemeConfig();

  const surface = theme.surfaces.panel;
  const border = theme.surfaces.border;
  const shadow = theme.overlays.cardShadow;
  const textPrimary = theme.palette.textPrimary;
  const textSecondary = theme.palette.textSecondary;

  return (
    <Dialog
      fullScreen
      open
      onClose={handleClose}
      slots={{ transition: Transition }}
      PaperProps={{
        sx: {
          background: theme.palette.pageBackground,
          color: textPrimary,
        },
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.surfaces.panel,
          borderBottom: `1px solid ${border}`,
          color: textPrimary,
        }}
      >
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Monitor de flujo en tiempo real
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ButtonGroup
            size="small"
            variant="outlined"
            sx={{ borderColor: border }}
          >
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setPreference(option.value)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 1.5,
                  borderColor: border,
                  backgroundColor:
                    preference === option.value
                      ? theme.surfaces.translucent
                      : "transparent",
                  color:
                    preference === option.value
                      ? textPrimary
                      : theme.palette.textSecondary,
                }}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
          <IconButton onClick={handleClose} sx={{ color: textPrimary }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, overflowY: "auto" }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Flujo de proceso recepción de pipa con alcohol, agua, LESS y
              Colgate
            </Typography>
            <Typography variant="body1" sx={{ color: textSecondary }}>
              Representación visual pensada para control operativo. Cada carril
              muestra las actividades principales por área y conserva la
              semántica del diagrama proporcionado.
            </Typography>
          </Stack>

          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 4,
              border: `1px solid ${border}`,
              backgroundColor: surface,
              boxShadow: theme.overlays.panelShadow,
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
              {laneConfig.map((lane) => (
                <Chip
                  key={lane.id}
                  label={lane.label}
                  sx={{
                    fontWeight: 600,
                    color: textPrimary,
                    borderLeft: `6px solid ${lane.accent}`,
                    backgroundColor: theme.surfaces.translucent,
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: border, mb: 3 }} />

            {/* Process represented with Reactflow */}
            <Box></Box>
            {/* Process represented with Reactflow */}
          </Paper>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RealTimeMonitor;
