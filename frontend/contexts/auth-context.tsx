"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getAuthToken, clearAuthToken } from "@/lib/api";
import {
  clearSession,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/services/auth";
import type { AuthUser, LoginRequest } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        clearSession();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(request: LoginRequest): Promise<AuthUser> {
    await loginRequest(request);

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return currentUser;
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  async function refreshUser(): Promise<AuthUser | null> {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      clearAuthToken();
      setUser(null);
      return null;
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
