// src/context/auth.context.tsx
"use client";

import { getProfileAPI, logoutAPI } from "@/services/auth.service";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type User = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // fetch profile khi load app
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfileAPI();
        if (res.suscess && res.user) {
          const data = await res.user;
          setUser(data);
        }
      } catch (err) {
        console.error("Fetch profile error", err);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutAPI();
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
