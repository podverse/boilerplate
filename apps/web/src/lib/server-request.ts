import 'server-only';

import { cookies } from 'next/headers';

import { getRuntimeConfig } from '../config/runtime-config-store';

function getApiVersionPath(): string {
  const ver = getRuntimeConfig().env.NEXT_PUBLIC_API_VERSION_PATH?.trim();
  return ver && ver.startsWith('/') ? ver : '/v1';
}

export function getServerApiBaseUrl(): string {
  const base = getRuntimeConfig().env.NEXT_PUBLIC_API_URL ?? '';
  const trimmed = base.replace(/\/$/, '');
  return trimmed + getApiVersionPath();
}

/**
 * Builds a Cookie header string from the current request's cookies.
 * Use when making server-side API requests that should forward auth.
 */
export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}
