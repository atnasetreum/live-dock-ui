"use client";

import { FilterAltOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { ReceptionProcessFilters } from "@/services/reception-processes.service";
import { useThemeConfig } from "@/theme/ThemeProvider";

type Props = {
  filters: ReceptionProcessFilters;
  searchDraft: string;
  materialOptions: string[];
  statusOptions: string[];
  onSearchDraftChange: (value: string) => void;
  onTypeOfMaterialChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearFilters: () => void;
};

const ReceptionProcessFilters = ({
  filters,
  searchDraft,
  materialOptions,
  statusOptions,
  onSearchDraftChange,
  onTypeOfMaterialChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: Props) => {
  const { theme } = useThemeConfig();
  const fieldSx = {
    "& .MuiInputLabel-root": {
      color: theme.palette.textSecondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.textPrimary,
    },
    "& .MuiOutlinedInput-root": {
      color: theme.palette.textPrimary,
      backgroundColor:
        theme.name === "dark"
          ? "rgba(12, 23, 52, 0.62)"
          : "rgba(255, 255, 255, 0.96)",
      "& fieldset": {
        borderColor: theme.surfaces.border,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.textSecondary,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.textPrimary,
      },
    },
    "& .MuiSelect-icon": {
      color: theme.palette.textSecondary,
    },
    "& .MuiInputBase-input::placeholder": {
      color: theme.palette.textSecondary,
      opacity: 1,
    },
  } as const;

  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: theme.surfaces.panel,
        color: theme.palette.textPrimary,
        border: `1px solid ${theme.surfaces.border}`,
        "& .MuiMenuItem-root": {
          color: theme.palette.textPrimary,
        },
      },
    },
  };

  const selectControlSx = {
    "& .MuiInputLabel-root": {
      color: theme.palette.textSecondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.textPrimary,
    },
    "& .MuiOutlinedInput-root": {
      color: theme.palette.textPrimary,
      backgroundColor:
        theme.name === "dark"
          ? "rgba(12, 23, 52, 0.62)"
          : "rgba(255, 255, 255, 0.96)",
      "& fieldset": {
        borderColor: theme.surfaces.border,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.textSecondary,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.textPrimary,
      },
    },
    "& .MuiSelect-icon": {
      color: theme.palette.textSecondary,
    },
  } as const;

  return (
    <Box
      sx={{
        mb: 2.5,
        p: { xs: 1.35, md: 1.6 },
        borderRadius: 3,
        background:
          theme.name === "dark"
            ? "linear-gradient(145deg, rgba(10,18,50,0.42), rgba(17,33,70,0.26))"
            : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(244,248,255,0.88))",
        border: `1px solid ${theme.surfaces.border}`,
        boxShadow: theme.overlays.cardShadow,
      }}
    >
      <Stack spacing={1.25}>
        <Typography
          variant="overline"
          sx={{
            color: theme.palette.textSecondary,
            letterSpacing: 1.4,
            lineHeight: 1,
            pl: 0.15,
          }}
        >
          Filtros de busqueda
        </Typography>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", lg: "center" }}
        >
          <TextField
            size="small"
            label="Buscar proveedor, placas o ID"
            value={searchDraft}
            onChange={(event) => onSearchDraftChange(event.target.value)}
            autoComplete="off"
            sx={{
              flex: { lg: 1.5 },
              minWidth: { xs: "100%", lg: 260 },
              ...fieldSx,
            }}
          />

          <FormControl
            size="small"
            sx={{
              flex: { lg: 1 },
              minWidth: { xs: "100%", lg: 170 },
              ...selectControlSx,
            }}
          >
            <InputLabel id="filter-material-label" shrink>
              Tipo de material
            </InputLabel>
            <Select
              labelId="filter-material-label"
              label="Tipo de material"
              value={filters.typeOfMaterial ?? ""}
              onChange={(event) => onTypeOfMaterialChange(event.target.value)}
              MenuProps={selectMenuProps}
              displayEmpty
              renderValue={(value) =>
                value ? (
                  value
                ) : (
                  <Typography
                    component="span"
                    sx={{ color: theme.palette.textSecondary }}
                  >
                    Todos
                  </Typography>
                )
              }
            >
              <MenuItem value="">Todos</MenuItem>
              {materialOptions.map((material) => (
                <MenuItem key={material} value={material}>
                  {material}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: { lg: 1.2 },
              minWidth: { xs: "100%", lg: 190 },
              ...selectControlSx,
            }}
          >
            <InputLabel id="filter-status-label" shrink>
              Estatus
            </InputLabel>
            <Select
              labelId="filter-status-label"
              label="Estatus"
              value={filters.status ?? ""}
              onChange={(event) => onStatusChange(event.target.value)}
              MenuProps={selectMenuProps}
              displayEmpty
              renderValue={(value) =>
                value ? (
                  value.replaceAll("_", " ")
                ) : (
                  <Typography
                    component="span"
                    sx={{ color: theme.palette.textSecondary }}
                  >
                    Todos
                  </Typography>
                )
              }
            >
              <MenuItem value="">Todos</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", lg: "center" }}
        >
          <TextField
            size="small"
            type="date"
            required
            label="Fecha inicio"
            value={filters.startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            inputProps={{ max: filters.endDate }}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", lg: 170 }, ...fieldSx }}
          />

          <TextField
            size="small"
            type="date"
            required
            label="Fecha fin"
            value={filters.endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            inputProps={{ min: filters.startDate }}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", lg: 170 }, ...fieldSx }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<FilterAltOff />}
            onClick={onClearFilters}
            sx={{
              minHeight: 42,
              textTransform: "none",
              fontWeight: 700,
              px: 2.2,
              width: { xs: "100%", lg: "auto" },
              color: theme.buttons.containedText,
              backgroundImage: theme.gradients.primary,
              boxShadow: theme.overlays.cardShadow,
              "&:hover": {
                backgroundImage: theme.gradients.primary,
                opacity: 0.92,
                boxShadow: theme.overlays.panelShadow,
              },
            }}
          >
            Limpiar filtros
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReceptionProcessFilters;
