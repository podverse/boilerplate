'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AUTH_MESSAGE_LOGIN_FAILED } from '@boilerplate/helpers';
import { webAuth } from '@boilerplate/helpers-requests';

import { getApiBaseUrl } from '../lib/api-client';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  setSession: (user: AuthUser) => void;
  hydrate: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseUserFromMe(data: unknown): AuthUser | null {
  if (data === undefined || typeof data !== 'object' || data === null) return null;
  if (!('user' in data) || typeof (data as { user: unknown }).user !== 'object') return null;
  const u = (data as { user: { id?: string; email?: string; displayName?: string | null } }).user;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName ?? null,
  };
}

function parseUserFromLoginOrRefresh(data: unknown): AuthUser | null {
  if (data === undefined || typeof data !== 'object' || data === null) return null;
  if (!('user' in data) || typeof (data as { user: unknown }).user !== 'object') return null;
  const u = (data as { user: { id?: string; email?: string; displayName?: string | null } }).user;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    const meRes = await webAuth.me(baseUrl);
    if (meRes.ok && meRes.data !== undefined) {
      const u = parseUserFromMe(meRes.data);
      if (u !== null) {
        setUser(u);
        setLoading(false);
        return;
      }
    }
    if (meRes.status === 401) {
      const refreshRes = await webAuth.refresh(baseUrl);
      if (refreshRes.ok && refreshRes.data !== undefined) {
        const u = parseUserFromLoginOrRefresh(refreshRes.data);
        if (u !== null) {
          setUser(u);
          setLoading(false);
          return;
        }
      }
    }
    setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ ok: true } | { ok: false; message: string }> => {
      const baseUrl = getApiBaseUrl();
      const res = await webAuth.login(baseUrl, email, password);
      if (!res.ok) {
        return { ok: false, message: res.error?.message ?? AUTH_MESSAGE_LOGIN_FAILED };
      }
      const data = res.data as { user?: { id: string; email: string; displayName: string | null } };
      const u = data?.user
        ? {
            id: data.user.id,
            email: data.user.email,
            displayName: data.user.displayName ?? null,
          }
        : null;
      if (u !== null) setUser(u);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    await webAuth.logout(baseUrl);
    setUser(null);
  }, []);

  const setSession = useCallback((u: AuthUser) => {
    setUser(u);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, setSession, hydrate }),
    [user, loading, login, logout, setSession, hydrate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
