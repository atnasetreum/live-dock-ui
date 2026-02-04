import { showToast } from "nextjs-toast-notify";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  duration?: number; // tiempo en ms
  position?: ToastPosition; // posición en pantalla
  progress?: boolean; // barra de progreso
  transition?: "fadeIn" | "bounceIn" | "popUp"; // animación
  sound?: boolean; // sonido opcional
}

export const Toast = {
  success: (message: string, options?: ToastOptions) =>
    showToast.success(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? "top-right",
      progress: options?.progress ?? true,
      transition: options?.transition ?? "fadeIn",
      sound: options?.sound ?? false,
    }),

  error: (message: string, options?: ToastOptions) =>
    showToast.error(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? "top-right",
      progress: options?.progress ?? true,
      transition: options?.transition ?? "fadeIn",
      sound: options?.sound ?? false,
    }),

  warning: (message: string, options?: ToastOptions) =>
    showToast.warning(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? "top-right",
      progress: options?.progress ?? true,
      transition: options?.transition ?? "fadeIn",
      sound: options?.sound ?? false,
    }),

  info: (message: string, options?: ToastOptions) =>
    showToast.info(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? "top-right",
      progress: options?.progress ?? true,
      transition: options?.transition ?? "fadeIn",
      sound: options?.sound ?? false,
    }),
};
