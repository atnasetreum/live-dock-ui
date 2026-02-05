import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
      autoConnect: false, // control manual de conexión
      withCredentials: true,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    console.log("Desconectando socket:", socket.id);
    socket.disconnect();
  }
};
