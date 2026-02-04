import axios, { AxiosInstance } from "axios";

import { Toast } from "@/utils";

export const headersDefault = {
  "Content-Type": "application/json",
  "x-app-key": process.env.NEXT_PUBLIC_APP_KEY!,
  // Protección básica
  "X-Content-Type-Options": "nosniff", // evita que el navegador interprete tipos MIME incorrectos
  "X-Frame-Options": "DENY", // evita que tu app se incruste en iframes (clickjacking)
  "Referrer-Policy": "no-referrer", // evita fuga de URLs sensibles en el header Referer
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    ...headersDefault,
  },
});

// Interceptor de request: añade token y trazabilidad
axiosClient.interceptors.request.use(
  (config) => {
    /* const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } */

    const requestId = crypto.randomUUID();

    // Ejemplo de trazabilidad
    config.headers["X-Request-ID"] = requestId;

    config.withCredentials = true;

    console.info(`[Frontend] Request ${requestId}`, {
      url: config.url,
      method: config.method,
      timestamp: new Date().toISOString(),
    });

    return config;
  },
  (error) => Promise.reject(error),
);

const DEFAULT_ERROR_MESSAGE =
  "Se produjo un error al procesar su solicitud, inténtelo nuevamente más tarde.";

// Interceptor de response: manejo de errores centralizado
axiosClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers["X-Request-ID"];
    console.info(`[Frontend] Response ${requestId}`, {
      status: response.status,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    // Aquí puedes loggear, auditar o normalizar errores
    const requestId = error.config?.headers?.["X-Request-ID"];
    console.error(`[Frontend] Error ${requestId}`, {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    const message =
      error?.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE;

    if (error?.response?.status === 401) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
        alert(message);
        //return notify(message);
      }
    }

    Toast.error(message);

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
