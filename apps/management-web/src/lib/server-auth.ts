import 'server-only';

import { cookies } from 'next/headers';

import { request } from '@boilerplate/helpers-requests';

import { getManagementApiBaseUrl } from '../config/env';
import type { ManagementUserPermissions } from '../types/management-api';

export type ServerUser = {
  id: string;
  email: string;
  displayName: string | null;
  isSuperAdmin: boolean;
  permissions?: ManagementUserPermissions | null;
};

function getServerApiBaseUrl(): string {
  return getManagementApiBaseUrl();
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

    const data = res.data as {
      user?: {
        id: string;
        email: string;
        displayName?: string;
        isSuperAdmin?: boolean;
        permissions?: ManagementUserPermissions | null;
      };
    };
    if (data.user === undefined) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.displayName ?? null,
      isSuperAdmin: data.user.isSuperAdmin === true,
      permissions: data.user.permissions,
    };
  } catch {
    return null;
  }
}
