"use client";

import type { ChangeEvent, ComponentProps } from "react";
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type FormState = {
  email: string;
  password: string;
};

const initialState: FormState = {
  email: "eduardo-266@hotmail.com",
  password: "123456",
};

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

const LoginPage = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "rgba(10,18,46,0.4)",
      color: "#fff",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.78)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.92)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fefefe",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.32)",
      },
    },
    "& .MuiInputAdornment-root, & .MuiInputLabel-root": {
      color: "#fff",
      transition: "color 120ms ease",
    },
    "& .MuiInputLabel-root": {
      px: 0.75,
      borderRadius: 1,
      backgroundColor: "rgba(7,11,32,0.92)",
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      backgroundColor: "rgba(7,11,32,0.92)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
  } as const;

  const handleChange =
    (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Fake delay to mimic a network request.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    //Navegar a la página principal del panel de control
    window.location.href = "/dashboard";

    setIsSubmitting(false);
  };

  return (
    <Box
      className={spaceGrotesk.className}
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #040a1c 0%, #0f2557 38%, #17507b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, md: 4 },
        py: { xs: 6, md: 10 },
        color: "#fff",
        "::before": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          top: "-10%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(73,118,255,0.6), transparent 60%)",
          filter: "blur(20px)",
        },
        "::after": {
          content: '""',
          position: "absolute",
          width: 320,
          height: 320,
          bottom: "-5%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(7,181,159,0.55), transparent 60%)",
          filter: "blur(18px)",
        },
      }}
    >
      <Box
        sx={{ position: "relative", width: "100%", maxWidth: 1100, zIndex: 1 }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 4, lg: 8 }}
          alignItems="stretch"
        >
          <Box
            id="info-section"
            sx={{
              flex: 1,
              color: "#fff",
              display: { xs: "none", lg: "flex" },
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 4 }}>
              LIVE DOCK
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
              Impulsa tus operaciones portuarias con accesos seguros
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: 520, color: "#fff" }}
            >
              Centraliza autorizaciones, visibilidad en tiempo real y métricas
              de desempeño en una sola plataforma. El módulo de acceso conecta a
              tus equipos con la data crítica en segundos.
            </Typography>
            <Divider
              sx={{ borderColor: "rgba(255,255,255,0.18)", maxWidth: 320 }}
            />
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {[
                { label: "99.98% uptime", emphasis: "Disponibilidad" },
                { label: "Auditorías SOC2", emphasis: "Confiable" },
                { label: "< 60s onboarding", emphasis: "Ágil" },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#fff" }}
                  >
                    {stat.emphasis}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              flexBasis: { xs: "100%", lg: 440 },
              alignSelf: "center",
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              background: "rgba(7, 11, 32, 0.82)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 80px rgba(2,7,21,0.65)",
              color: "#fff",
              backdropFilter: "blur(16px)",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Acceso a LiveDock Control
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff" }}
                >
                  Ingresa tus credenciales o invita a tu equipo.
                </Typography>
              </Box>

              <TextField
                label="Correo corporativo"
                type="email"
                required
                autoComplete="email"
                value={formState.email}
                onChange={handleChange("email")}
                sx={textFieldSx}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={formState.password}
                onChange={handleChange("password")}
                sx={textFieldSx}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                disabled={isSubmitting}
                sx={{
                  py: 1.4,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  color: "#fff",
                }}
              >
                {isSubmitting ? "Autenticando…" : "Entrar al panel"}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
