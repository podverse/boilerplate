/**
 * Runtime config shape served by the sidecar and consumed by the Next.js app.
 */

export type WebRuntimeConfigEnvKey = 'NEXT_PUBLIC_APP_NAME' | 'NEXT_PUBLIC_API_URL';

export interface WebRuntimeConfig {
  env: Partial<Record<WebRuntimeConfigEnvKey, string>>;
}
