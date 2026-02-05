"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SocketProvider } from "@/common/SocketProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import ThemeSwitcher from "@/theme/ThemeSwitcher";

const SOCKET_EXCLUDED_ROUTES = ["/"];

const Providers = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const shouldEnableSocket = !SOCKET_EXCLUDED_ROUTES.includes(pathname);

  const content = shouldEnableSocket ? (
    <SocketProvider>{children}</SocketProvider>
  ) : (
    children
  );

  return (
    <ThemeProvider>
      <ThemeSwitcher />
      {content}
    </ThemeProvider>
  );
};

export default Providers;
