/**
 * Runtime config shape served by the management-web sidecar and consumed by the Next.js app.
 */

export type ManagementWebRuntimeConfigEnvKey =
  | 'NEXT_PUBLIC_MANAGEMENT_API_URL'
  | 'NEXT_PUBLIC_MANAGEMENT_API_VERSION_PATH'
  | 'NEXT_PUBLIC_MANAGEMENT_SESSION_REFRESH_INTERVAL_MS'
  | 'NEXT_PUBLIC_BRAND_NAME'
  | 'NEXT_PUBLIC_APP_TITLE_ICON'
  | 'NEXT_PUBLIC_WEB_APP_URL'
  | 'DEFAULT_LOCALE'
  | 'SUPPORTED_LOCALES'
  | 'MANAGEMENT_API_BACKEND_URL';

export interface ManagementWebRuntimeConfig {
  env: Partial<Record<ManagementWebRuntimeConfigEnvKey, string>>;
}
