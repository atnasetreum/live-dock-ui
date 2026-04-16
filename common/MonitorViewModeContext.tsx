"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import { useSocket } from "@/common/SocketProvider";
import { useCurrentUser } from "@/common/UserContext";
import { MonitorViewMode, ProcessEventRole } from "@/types";

type MonitorViewModeContextValue = {
  monitorViewMode: MonitorViewMode;
  setMonitorViewMode: (viewMode: MonitorViewMode) => void;
};

const MonitorViewModeContext = createContext<
  MonitorViewModeContextValue | undefined
>(undefined);

const isMonitorViewMode = (value: unknown): value is MonitorViewMode =>
  value === "timeline" || value === "horizontal" || value === "desktop";

export const MonitorViewModeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [monitorViewMode, setMonitorViewModeState] =
    useState<MonitorViewMode>("horizontal");
  const { socket } = useSocket();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!socket) return undefined;

    const handleModeUpdate = (payload: { viewMode?: unknown }) => {
      if (isMonitorViewMode(payload?.viewMode)) {
        setMonitorViewModeState(payload.viewMode);
      }
    };

    socket.on("monitor:view_mode:update", handleModeUpdate);
    socket.emit("monitor:view_mode:get");

    return () => {
      socket.off("monitor:view_mode:update", handleModeUpdate);
    };
  }, [socket]);

  const setMonitorViewMode = (viewMode: MonitorViewMode) => {
    setMonitorViewModeState(viewMode);

    if (!socket) return;

    if (currentUser.role === ProcessEventRole.ADMIN) {
      socket.emit("monitor:view_mode:set", { viewMode });
    }
  };

  const value = useMemo(
    () => ({
      monitorViewMode,
      setMonitorViewMode,
    }),
    [monitorViewMode],
  );

  return (
    <MonitorViewModeContext.Provider value={value}>
      {children}
    </MonitorViewModeContext.Provider>
  );
};

export const useMonitorViewMode = () => {
  const context = useContext(MonitorViewModeContext);

  if (!context) {
    throw new Error(
      "useMonitorViewMode must be used within a MonitorViewModeProvider",
    );
  }

  return context;
};
