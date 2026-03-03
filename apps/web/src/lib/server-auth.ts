import 'server-only';

import { cookies, headers } from 'next/headers';

import { request } from '@boilerplate/helpers-requests';

import { getRuntimeConfig } from '../config/runtime-config-store';

export type ServerUser = {
  id: string;
  shortId: string;
  email: string;
  displayName: string | null;
  profileVisibility: boolean;
};

const AUTH_USER_HEADER = 'x-auth-user';

function getApiVersionPath(): string {
  const ver = getRuntimeConfig().env.NEXT_PUBLIC_API_VERSION_PATH?.trim();
  return ver && ver.startsWith('/') ? ver : '/v1';
}

function getServerApiBaseUrl(): string {
  const base = getRuntimeConfig().env.NEXT_PUBLIC_API_URL ?? '';
  const trimmed = base.replace(/\/$/, '');
  return trimmed + getApiVersionPath();
}

function parseAuthUserHeader(value: string | null): ServerUser | null {
  if (value === null || value === '') return null;
  try {
    const parsed = JSON.parse(value) as {
      id?: string;
      shortId?: string;
      email?: string;
      displayName?: string | null;
      profileVisibility?: boolean;
    };
    if (typeof parsed.id !== 'string' || typeof parsed.email !== 'string') {
      return null;
    }
    return {
      id: parsed.id,
      shortId: typeof parsed.shortId === 'string' ? parsed.shortId : parsed.id,
      email: parsed.email,
      displayName: parsed.displayName ?? null,
      profileVisibility: parsed.profileVisibility === true,
    };
  } catch {
    return null;
  }
}

/**
 * Get the current user from the API server-side.
 * Prefers x-auth-user header when set by middleware (after SSR session restore).
 * Otherwise forwards cookies from the incoming request to the API.
 * Returns null if not authenticated.
 */
export async function getServerUser(): Promise<ServerUser | null> {
  const headerStore = await headers();
  const authUserHeader = headerStore.get(AUTH_USER_HEADER);
  const fromHeader = parseAuthUserHeader(authUserHeader);
  if (fromHeader !== null) {
    return fromHeader;
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  if (cookieHeader === '') {
    return null;
  }

  const baseUrl = getServerApiBaseUrl();

  try {
    const res = await request(baseUrl, '/auth/me', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok || res.data === undefined) {
      return null;
    }

    const data = res.data as { user?: ServerUser };
    if (data.user === undefined) {
      return null;
    }

    return {
      id: data.user.id,
      shortId: typeof data.user.shortId === 'string' ? data.user.shortId : data.user.id,
      email: data.user.email,
      displayName: data.user.displayName ?? null,
      profileVisibility: data.user.profileVisibility === true,
    };
  } catch {
    return null;
  }
}
