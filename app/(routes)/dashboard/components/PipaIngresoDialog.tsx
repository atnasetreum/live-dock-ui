"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useThemeConfig } from "@/theme/ThemeProvider";

type PipaIngresoDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  materialType: string;
  onClose: () => void;
  onConfirm: () => void;
  onMaterialTypeChange: (value: string) => void;
};

const PipaIngresoDialog = ({
  open,
  isSubmitting,
  materialType,
  onClose,
  onConfirm,
  onMaterialTypeChange,
}: PipaIngresoDialogProps) => {
  const { theme } = useThemeConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(3, 8, 20, 0.7)",
          backdropFilter: "blur(2px)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          backgroundColor: theme.forms.labelBackground,
          border: `1px solid ${theme.surfaces.border}`,
          boxShadow: theme.overlays.panelShadow,
        },
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              background: theme.surfaces.iconBox,
              display: "grid",
              placeItems: "center",
            }}
          >
            <LocalShippingIcon sx={{ color: theme.palette.textPrimary }} />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 2, color: theme.palette.textSecondary }}
            >
              Confirmacion
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.textPrimary }}
            >
              Ingreso de pipa
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2.5 }}>
        <Typography sx={{ color: theme.palette.textSecondary }}>
          Esta accion creara un nuevo proceso de recepcion.{" "}
          <center>¿Deseas continuar?</center>
        </Typography>
        <FormControl
          fullWidth
          size="small"
          sx={{
            mt: 2,
            "& .MuiInputLabel-root": {
              color: theme.palette.textSecondary,
              backgroundColor: theme.forms.labelBackground,
              px: 0.6,
              borderRadius: 1,
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.forms.fieldBackground,
              color: theme.forms.inputColor,
              borderRadius: 2,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.forms.border,
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.forms.borderHover,
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: theme.forms.borderFocus,
                boxShadow: theme.forms.focusShadow,
              },
          }}
        >
          <InputLabel id="pipa-material-type-label">
            Tipo de material
          </InputLabel>
          <Select
            labelId="pipa-material-type-label"
            name="materialType"
            value={materialType}
            label="Tipo de material"
            onChange={(event) => onMaterialTypeChange(event.target.value)}
          >
            <MenuItem value="ALCOHOL">ALCOHOL</MenuItem>
            <MenuItem value="AGUA">AGUA</MenuItem>
            <MenuItem value="LESS">LESS</MenuItem>
            <MenuItem value="COLGATE">COLGATE</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2.5,
          pt: 0,
          gap: 1.5,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
            borderColor: theme.buttons.outlinedColor,
            color: theme.buttons.outlinedColor,
            "&:hover": {
              borderColor: theme.buttons.outlinedColor,
              backgroundColor: theme.surfaces.translucent,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isSubmitting || !materialType}
          fullWidth
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : undefined
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
            backgroundImage: theme.gradients.primary,
            color: theme.buttons.containedText,
            boxShadow: theme.overlays.cardShadow,
          }}
        >
          {isSubmitting ? "Procesando…" : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PipaIngresoDialog;
