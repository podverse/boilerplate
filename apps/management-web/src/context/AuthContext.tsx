'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AUTH_MESSAGE_LOGIN_FAILED } from '@boilerplate/helpers';
import { getRateLimitRetrySeconds, managementWebAuth } from '@boilerplate/helpers-requests';

import { getApiBaseUrl } from '../lib/api-client';
import { isPublicPath, ROUTES } from '../lib/routes';

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
  ) => Promise<
    { ok: true } | { ok: false; message: string; rateLimit?: { retryAfterSeconds: number } }
  >;
  logout: () => void;
  setSession: (user: AuthUser) => void;
  hydrate: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * How often (ms) to proactively refresh the access token while the user is logged in.
 * Must be less than JWT_ACCESS_EXPIRY_SECONDS on the management API (default: 15 min = 900s).
 * 10 minutes gives a comfortable buffer before the 15-minute JWT expires.
 */
const SESSION_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

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

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null);
  const [loading, setLoading] = useState(false);

  const hydrate = useCallback(async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const meRes = await managementWebAuth.me(baseUrl);
      if (meRes.ok && meRes.data !== undefined) {
        const u = parseUserFromMe(meRes.data);
        if (u !== null) {
          setUser(u);
          return;
        }
      }
      const meWas401 = meRes.status === 401;
      if (meWas401) {
        const refreshRes = await managementWebAuth.refresh(baseUrl);
        if (refreshRes.ok && refreshRes.data !== undefined) {
          const u = parseUserFromLoginOrRefresh(refreshRes.data);
          if (u !== null) {
            setUser(u);
            return;
          }
        }
      }
      setUser(null);
      if (meWas401) {
        try {
          await managementWebAuth.logout(baseUrl);
        } catch {
          // ignore; redirect anyway
        }
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        if (!isPublicPath(pathname)) {
          window.location.href = ROUTES.LOGIN;
        }
        return;
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hydrate if no initial user was provided, or if SSR could not authenticate
  // (initialUser === null means the JWT was expired/missing at SSR time — client
  // should attempt refresh before giving up).
  useEffect(() => {
    if (initialUser === undefined || initialUser === null) {
      void hydrate();
    }
  }, [hydrate, initialUser]);

  // Proactively refresh the access token before it expires while the user is
  // logged in. Fires every SESSION_REFRESH_INTERVAL_MS (10 min) as long as
  // `user` is non-null, restarting the interval whenever the user changes.
  useEffect(() => {
    if (user === null) return;

    const interval = setInterval(async () => {
      const baseUrl = getApiBaseUrl();
      const refreshRes = await managementWebAuth.refresh(baseUrl);
      if (refreshRes.ok && refreshRes.data !== undefined) {
        const u = parseUserFromLoginOrRefresh(refreshRes.data);
        if (u !== null) {
          setUser(u);
          return;
        }
      }
      // Refresh failed — session is no longer valid.
      setUser(null);
      try {
        await managementWebAuth.logout(baseUrl);
      } catch {
        // ignore; redirect anyway
      }
      window.location.href = ROUTES.LOGIN;
    }, SESSION_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<
      { ok: true } | { ok: false; message: string; rateLimit?: { retryAfterSeconds: number } }
    > => {
      const baseUrl = getApiBaseUrl();
      const res = await managementWebAuth.login(baseUrl, email, password);
      if (!res.ok) {
        const message = res.error?.message ?? AUTH_MESSAGE_LOGIN_FAILED;
        const rateLimit =
          res.status === 429
            ? {
                retryAfterSeconds: getRateLimitRetrySeconds(
                  'management:login',
                  res.error?.retryAfterSeconds
                ),
              }
            : undefined;
        return { ok: false, message, rateLimit };
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
    await managementWebAuth.logout(baseUrl);
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
