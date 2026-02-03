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
import ProcessFlow from "./ProcessFlow";
import { laneConfig } from "./processFlowData";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

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

            <Box>
              <ProcessFlow />
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RealTimeMonitor;
