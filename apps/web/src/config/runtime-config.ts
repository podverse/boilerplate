/**
 * Runtime config shape served by the sidecar and consumed by the Next.js app.
 */

export type WebRuntimeConfigEnvKey =
  | 'NEXT_PUBLIC_BRAND_NAME'
  | 'NEXT_PUBLIC_APP_TITLE_ICON'
  | 'NEXT_PUBLIC_API_URL'
  | 'NEXT_PUBLIC_API_VERSION_PATH'
  | 'NEXT_PUBLIC_AUTH_MODE'
  | 'NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS'
  | 'NEXT_PUBLIC_WEB_APP_URL'
  | 'NEXT_PUBLIC_DEFAULT_LOCALE'
  | 'NEXT_PUBLIC_SUPPORTED_LOCALES'
  | 'API_BACKEND_URL';

export interface WebRuntimeConfig {
  env: Partial<Record<WebRuntimeConfigEnvKey, string>>;
}
