"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";
import type { Socket } from "socket.io-client";

import { connectSocket, disconnectSocket } from "@/libs/socket";

type SocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const instance = connectSocket();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(instance);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    if (instance.connected) {
      setIsConnected(true);
    }

    instance.on("connect", handleConnect);
    instance.on("disconnect", handleDisconnect);

    return () => {
      instance.off("connect", handleConnect);
      instance.off("disconnect", handleDisconnect);
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
    }),
    [socket, isConnected],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
