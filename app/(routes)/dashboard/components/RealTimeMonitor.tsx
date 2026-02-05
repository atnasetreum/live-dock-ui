import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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

import { useThemeConfig } from "@/theme/ThemeProvider";
import { laneConfig } from "./processFlowData";
import ProcessFlow from "./ProcessFlow";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RealTimeMonitor = ({ handleClose }: { handleClose: () => void }) => {
  const { theme } = useThemeConfig();

  const surface = theme.surfaces.panel;
  const border = theme.surfaces.border;
  const textPrimary = theme.palette.textPrimary;

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
            Flujo de proceso recepción de pipa con alcohol, agua, LESS y Colgate
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose} sx={{ color: textPrimary }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, overflowY: "auto" }}
      >
        <Stack spacing={1}>
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
