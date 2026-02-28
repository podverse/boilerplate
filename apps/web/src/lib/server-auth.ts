import 'server-only';

import { cookies } from 'next/headers';

import { request } from '@boilerplate/helpers-requests';

import { getRuntimeConfig } from '../config/runtime-config-store';

export type ServerUser = {
  id: string;
  email: string;
  displayName: string | null;
};

const API_VERSION = '/v1';

function getServerApiBaseUrl(): string {
  const base = getRuntimeConfig().env.NEXT_PUBLIC_API_URL ?? '';
  const trimmed = base.replace(/\/$/, '');
  return trimmed + API_VERSION;
}

/**
 * Get the current user from the API server-side.
 * Forwards cookies from the incoming request to the API.
 * Returns null if not authenticated.
 */
export async function getServerUser(): Promise<ServerUser | null> {
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
      email: data.user.email,
      displayName: data.user.displayName ?? null,
    };
  } catch {
    return null;
  }
}
