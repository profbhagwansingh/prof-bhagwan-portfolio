"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
}

interface UseAuthReturn {
  /** Current authenticated admin user, or null */
  user: AdminUser | null;
  /** Whether the auth state is still loading */
  loading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Login with email and password. Returns true on success. */
  login: (email: string, password: string) => Promise<boolean>;
  /** Logout and redirect to login page */
  logout: () => void;
  /** Check if the user has a specific role */
  hasRole: (...roles: AdminUser["role"][]) => boolean;
}

const TOKEN_KEY = "admin_token";

/**
 * Admin authentication hook.
 * Manages JWT tokens, user profile, and auth state.
 *
 * @example
 * const { user, isAuthenticated, login, logout, hasRole } = useAuth();
 * if (!isAuthenticated) redirect("/admin/login");
 * if (hasRole("SUPER_ADMIN")) showDeleteButton();
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/api/auth/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      setUser(userData ?? null);

      // If user data wasn't included in login response, fetch profile
      if (!userData) {
        const profileRes = await api.get("/api/auth/profile");
        setUser(profileRes.data);
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  const hasRole = useCallback(
    (...roles: AdminUser["role"][]) => {
      return user ? roles.includes(user.role) : false;
    },
    [user]
  );

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
  };
}
