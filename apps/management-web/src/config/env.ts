/**
 * Management web app env. Use NEXT_PUBLIC_* for client.
 */

/** Base URL of the management API (no version path). */
export function getManagementApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_MANAGEMENT_API_URL ?? '';
  return url.replace(/\/$/, '');
}

/** API version path prefix (e.g. /v1). Always starts with /. */
export function getManagementApiVersionPath(): string {
  const path = process.env.NEXT_PUBLIC_MANAGEMENT_API_VERSION_PATH?.trim() ?? '/v1';
  return path.startsWith('/') ? path : `/${path}`;
}

/** Full base URL for API requests (base URL + version path). */
export function getManagementApiBaseUrl(): string {
  return getManagementApiUrl() + getManagementApiVersionPath();
}
