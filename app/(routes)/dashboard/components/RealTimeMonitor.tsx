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
import { ReceptionProcess } from "@/types";
import ProcessFlow from "./ProcessFlow";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  handleClose: () => void;
  receptionProcess: ReceptionProcess;
}

const RealTimeMonitor = ({ handleClose, receptionProcess }: Props) => {
  const { theme } = useThemeConfig();
  const { events } = receptionProcess;

  const surface = theme.surfaces.panel;
  const border = theme.surfaces.border;
  const textPrimary = theme.palette.textPrimary;

  const lastStatus = React.useMemo(() => {
    return events[events.length - 1]?.status ?? "SIN_EVENTOS";
  }, [events]);

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
            Flujo del proceso # {receptionProcess.id} -{" "}
            {receptionProcess.typeOfMaterial}
          </Typography>
          <Chip
            size="small"
            label={lastStatus.replaceAll("_", " ")}
            sx={{
              fontWeight: 600,
              color: textPrimary,
              backgroundColor: !lastStatus.includes("RECHAZO")
                ? theme.surfaces.translucent
                : theme.palette.errorTranslucent,
              border: `1px solid ${border}`,
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose} sx={{ color: textPrimary }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          overflowY: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={1} sx={{ flex: 1 }}>
          <ProcessFlow
            receptionProcess={receptionProcess}
            lastStatus={lastStatus}
          />
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RealTimeMonitor;
