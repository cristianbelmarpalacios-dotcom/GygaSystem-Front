"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, setAdminToken } from "@/lib/api/client";
import { ADMIN_TOKEN_KEY } from "@/lib/api/config";
import type { AuthUser, LoginResponse } from "@/lib/api/types";
import { hasAnyView, buildPermissionMap } from "@/lib/admin/permissions";

type AdminAuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function isStaffRole(role: string) {
  return role === "ADMIN" || role === "STAFF";
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiFetch<AuthUser>("/v1/auth/me");
      if (!isStaffRole(me.role)) {
        setAdminToken(null);
        setUser(null);
        return;
      }
      const map = buildPermissionMap(me.permissions ?? []);
      if (!hasAnyView(map)) {
        setAdminToken(null);
        setUser(null);
        return;
      }
      setUser(me);
    } catch {
      setAdminToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (existing) setAdminToken(existing);
      }
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<LoginResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, { skipAuth: true });
    if (!isStaffRole(res.user.role)) {
      throw new Error("Esta cuenta no tiene permisos de administración.");
    }
    const map = buildPermissionMap(res.user.permissions ?? []);
    if (!hasAnyView(map)) {
      throw new Error(
        "Tu rol no tiene permisos asignados. Contacta a un administrador.",
      );
    }
    setAdminToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isStaff: user ? isStaffRole(user.role) : false,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  return ctx;
}
