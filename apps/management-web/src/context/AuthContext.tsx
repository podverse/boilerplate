'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AUTH_MESSAGE_LOGIN_FAILED } from '@boilerplate/helpers';
import { managementWebAuth } from '@boilerplate/helpers-requests';

import { getApiBaseUrl } from '../lib/api-client';
import type { ManagementUser } from '../types/management-api';

/** Same shape as user from /auth/me and /auth/login. */
export type AuthUser = ManagementUser;

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  hydrate: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseUserFromMe(data: unknown): ManagementUser | null {
  if (data === undefined || typeof data !== 'object' || data === null) return null;
  if (!('user' in data) || typeof (data as { user: unknown }).user !== 'object') return null;
  const u = (data as { user: ManagementUser }).user;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return u;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    const meRes = await managementWebAuth.me(baseUrl);
    if (meRes.ok && meRes.data !== undefined) {
      const u = parseUserFromMe(meRes.data);
      if (u !== null) {
        setUser(u);
        setLoading(false);
        return;
      }
    }
    if (meRes.status === 401) {
      const refreshRes = await managementWebAuth.refresh(baseUrl);
      if (refreshRes.ok && refreshRes.data !== undefined) {
        const u = parseUserFromMe(refreshRes.data);
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
      const res = await managementWebAuth.login(baseUrl, email, password);
      if (!res.ok) {
        return { ok: false, message: res.error?.message ?? AUTH_MESSAGE_LOGIN_FAILED };
      }
      const data = res.data as { user?: ManagementUser };
      if (data?.user !== undefined) setUser(data.user);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    await managementWebAuth.logout(baseUrl);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, hydrate }),
    [user, loading, login, logout, hydrate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
