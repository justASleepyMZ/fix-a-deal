import React, { createContext, useContext, useState } from "react";

export type GuestRole = "user" | "worker" | "admin" | "company" | null;

interface RoleContextType {
  role: GuestRole;
  setRole: (role: GuestRole) => void;
  isGuest: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
  isGuest: false,
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<GuestRole>(null);

  return (
    <RoleContext.Provider value={{ role, setRole, isGuest: role !== null }}>
      {children}
    </RoleContext.Provider>
  );
};
