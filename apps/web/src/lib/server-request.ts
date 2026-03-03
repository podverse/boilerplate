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

/**
 * Parses filterColumns from searchParams and returns only valid column ids.
 * When empty or invalid, returns validColumnIds (all columns).
 */
export function parseFilterColumns(
  resolvedSearchParams: { filterColumns?: string },
  validColumnIds: string[]
): string[] {
  const raw = resolvedSearchParams.filterColumns ?? '';
  if (raw.trim() === '') return validColumnIds;
  const parsed = raw
    .split(',')
    .map((s) => s.trim())
    .filter((id) => validColumnIds.includes(id));
  return parsed.length > 0 ? parsed : validColumnIds;
}
