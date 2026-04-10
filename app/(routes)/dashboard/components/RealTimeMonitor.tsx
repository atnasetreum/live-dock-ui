import { forwardRef, ReactElement, Ref, useEffect, useMemo } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import Swal from "sweetalert2";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { ProcessEventRole, ProcessState, ReceptionProcess } from "@/types";
import ProcessFlow from "./ProcessFlow";
import { useCurrentUser } from "@/common/UserContext";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<unknown> },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  handleClose: () => void;
  receptionProcess: ReceptionProcess;
}

const RealTimeMonitor = ({ handleClose, receptionProcess }: Props) => {
  const { theme } = useThemeConfig();
  const { events, providerName, licensePlates } = receptionProcess;

  const { role } = useCurrentUser();

  const border = theme.surfaces.border;
  const textPrimary = theme.palette.textPrimary;

  const lastStatus = useMemo(() => {
    return events[events.length - 1]?.status ?? "SIN_EVENTOS";
  }, [events]);

  useEffect(() => {
    if (role === ProcessEventRole.SISTEMA) {
      if (
        lastStatus ===
        ProcessState.PRODUCCION_PENDIENTE_DE_CONFIRMACION_PARA_DESCARGA
      ) {
        Swal.fire({
          icon: "success",
          title: "¡Material aprobado por calidad!",
          html: `<strong>Proveedor:</strong> ${providerName || ""}`,
          footer: `<strong>Placas:</strong> ${licensePlates || ""}`,
          showConfirmButton: false,
          timer: 15000,
          timerProgressBar: true,
          background: "#fff url(/images/fondo.jpeg) no-repeat",
          backdrop: `
          rgba(3, 3, 47, 0.4)
          url("/images/ok.gif") 
          left top
          no-repeat
        `,
          didOpen: () => {
            const container = Swal.getContainer();
            if (container) {
              container.style.zIndex = "1600";
            }
          },
        });
      } else if (lastStatus === ProcessState.FINALIZO_PROCESO_POR_RECHAZO) {
        Swal.fire({
          icon: "error",
          title: `Material rechazado por ${events.length > 3 ? "calidad" : "logistica"}!`,
          html: `<strong>Proveedor:</strong> ${providerName || ""}`,
          footer: `<strong>Placas:</strong> ${licensePlates || ""}`,
          showConfirmButton: false,
          timer: 15000,
          timerProgressBar: true,
          background: "#fff url(/images/fondo.jpeg) no-repeat",
          backdrop: `
          rgba(3, 3, 47, 0.4)
          url("/images/reject.gif") 
          left top
          no-repeat
        `,
          didOpen: () => {
            const container = Swal.getContainer();
            if (container) {
              container.style.zIndex = "1600";
            }
          },
        });
      }
    }
  }, [providerName, licensePlates, lastStatus, role]);

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
          <IconButton
            onClick={handleClose}
            aria-label="Cerrar monitor"
            sx={{ color: textPrimary }}
          >
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
            currentStatus={lastStatus}
          />
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RealTimeMonitor;
