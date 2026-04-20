import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authStorage } from "@/services/api/client";
import type { AuthUser, UserRole } from "@/features/auth/types";
import { normalizeAuthUser } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = authStorage.get() as AuthUser | null;
    const normalized = normalizeAuthUser(stored);
    if (normalized.token) {
      authStorage.set(normalized);
      setUser(normalized);
    }
    setIsLoading(false);
  }, []);

  const login = (u: AuthUser) => {
    const normalized = normalizeAuthUser(u);
    authStorage.set(normalized);
    setUser(normalized);
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user?.token,
    hasRole: (role) => !!user?.roles?.includes(role),
    hasAnyRole: (roles) => !!user?.roles?.some((r) => roles.includes(r)),
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function getDefaultRouteForRole(roles: UserRole[]): string {
  if (roles.includes("ADMIN")) return "/admin/dashboard";
  if (roles.includes("HOST")) return "/host/dashboard";
  if (roles.includes("SECURITY")) return "/security/dashboard";
  return "/login";
}
