module.exports = {
  apps: [
    {
      name: "live-dock-ui", // Nombre de la aplicación
      script: "node_modules/next/dist/bin/next", // Script de Next.js
      args: "start -p 3001", // Comando para producción
      cwd: "./", // Directorio raíz del proyecto
      instances: 1, // Usa una sola instancia en modo fork
      exec_mode: "fork", // Modo de ejecución (fork o cluster)
      env: {
        NODE_ENV: "production", // Variables de entorno
        PORT: 3001,
      },
      watch: false, // No observar cambios en producción
      max_memory_restart: "500M", // Reiniciar si excede memoria
      out_file: "./logs/out.log", // Log de salida
      error_file: "./logs/error.log", // Log de errores
      merge_logs: true, // Unificar logs
      time: true, // Timestamp en logs
    },
  ],
};
