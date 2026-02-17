"use client";

import { createContext, useContext, ReactNode } from "react";

import { UsersOnDuty } from "@/types";

interface UserContextType {
  currentUser: UsersOnDuty;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: UsersOnDuty;
}) {
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within UserProvider");
  }
  return context.currentUser;
}
