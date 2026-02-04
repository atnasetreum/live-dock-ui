"use client";

import { JSX, useState, type MouseEvent } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import {
  Box,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useThemeConfig } from "./ThemeProvider";
import type { ThemePreference } from "./tokens";

const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
};

const OPTION_ICONS: Record<ThemePreference, JSX.Element> = {
  system: <SettingsBrightnessIcon fontSize="small" />,
  light: <LightModeIcon fontSize="small" />,
  dark: <DarkModeIcon fontSize="small" />,
};

const themeOptions: Array<{
  value: ThemePreference;
  description: string;
}> = [
  { value: "system", description: "Sincroniza con tu dispositivo" },
  { value: "light", description: "Usa colores claros" },
  { value: "dark", description: "Usa colores profundos" },
];

const ThemeSwitcher = () => {
  const { preference, setPreference, theme } = useThemeConfig();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    handleClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1300,
      }}
    >
      <Button
        size="small"
        variant="contained"
        startIcon={<PaletteIcon fontSize="small" />}
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          borderRadius: 999,
          fontWeight: 600,
          backgroundImage: theme.gradients.primary,
          color: theme.buttons.containedText,
          boxShadow: theme.overlays.cardShadow,
          px: 2.5,
        }}
      >
        Tema · {THEME_LABELS[preference]}
      </Button>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            backgroundColor: theme.surfaces.panel,
            border: `1px solid ${theme.surfaces.border}`,
            boxShadow: theme.overlays.panelShadow,
            color: theme.palette.textPrimary,
            minWidth: 180,
          },
        }}
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            selected={preference === option.value}
            sx={{
              borderRadius: 1.5,
              alignItems: "flex-start",
              py: 1.25,
              gap: 1,
              "&.Mui-selected": {
                backgroundColor: theme.surfaces.translucent,
              },
              "&.Mui-selected:hover": {
                backgroundColor: theme.surfaces.translucent,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: theme.palette.textPrimary,
              }}
            >
              {OPTION_ICONS[option.value]}
            </ListItemIcon>
            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {THEME_LABELS[option.value]}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.textSecondary }}
              >
                {option.description}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ThemeSwitcher;
