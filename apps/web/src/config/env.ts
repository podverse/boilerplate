/**
 * Web app env. Use NEXT_PUBLIC_* for client.
 * When RUNTIME_CONFIG_URL is set, values come from the sidecar (getRuntimeConfig()); otherwise from process.env.
 */

import type { WebRuntimeConfigEnvKey } from './runtime-config';

import { getRuntimeConfig } from './runtime-config-store';

function env(key: WebRuntimeConfigEnvKey): string | undefined {
  const val = getRuntimeConfig().env[key];
  return typeof val === 'string' ? val : undefined;
}

/** Base URL of the API (no version path). */
export function getApiUrl(): string {
  const url = env('NEXT_PUBLIC_API_URL') ?? '';
  return url.replace(/\/$/, '');
}

/** API version path prefix (e.g. /v1). Always starts with /. */
export function getApiVersionPath(): string {
  const path = env('NEXT_PUBLIC_API_VERSION_PATH')?.trim() ?? '/v1';
  return path.startsWith('/') ? path : `/${path}`;
}

/** Full base URL for API requests (base URL + version path). */
export function getApiBaseUrl(): string {
  return getApiUrl() + getApiVersionPath();
}

/**
 * Server-only: full base URL for pod-internal API calls.
 * Prefers API_BACKEND_URL (k8s-internal DNS) over NEXT_PUBLIC_API_URL (browser-facing).
 * Falls back to getApiBaseUrl() when API_BACKEND_URL is not set.
 */
export function getServerApiBaseUrl(): string {
  const backend = env('API_BACKEND_URL')?.trim();
  if (backend !== undefined && backend !== '') {
    return backend.replace(/\/$/, '') + getApiVersionPath();
  }
  return getApiBaseUrl();
}

/** NEXT_PUBLIC_AUTH_MODE (for server components; pass to client as needed). */
export function getAuthMode(): string | undefined {
  return env('NEXT_PUBLIC_AUTH_MODE')?.trim();
}

/** NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS (for server/client auth refresh loop). */
export function getSessionRefreshIntervalMs(): string | undefined {
  return env('NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS')?.trim();
}

/** NEXT_PUBLIC_BRAND_NAME (for server components; pass to client as needed). */
export function getBrandName(): string | undefined {
  return env('NEXT_PUBLIC_BRAND_NAME')?.trim() || undefined;
}

/** NEXT_PUBLIC_APP_TITLE_ICON (for server components; pass to client as needed). */
export function getAppTitleIcon(): string | undefined {
  const value = env('NEXT_PUBLIC_APP_TITLE_ICON');
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/** NEXT_PUBLIC_WEB_APP_URL (e.g. http://localhost:4002). No trailing slash. */
export function getWebAppUrl(): string | undefined {
  const url = env('NEXT_PUBLIC_WEB_APP_URL')?.trim();
  if (url === undefined || url === '') return undefined;
  return url.replace(/\/$/, '');
}

/** NEXT_PUBLIC_DEFAULT_LOCALE (for i18n). */
export function getDefaultLocaleEnv(): string | undefined {
  return env('NEXT_PUBLIC_DEFAULT_LOCALE')?.trim();
}

/** NEXT_PUBLIC_SUPPORTED_LOCALES (for i18n). */
export function getSupportedLocalesEnv(): string | undefined {
  return env('NEXT_PUBLIC_SUPPORTED_LOCALES')?.trim();
}
