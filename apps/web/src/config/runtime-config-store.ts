import type { WebRuntimeConfig } from './runtime-config';

declare global {
  var __BOILERPLATE_RUNTIME_CONFIG__: WebRuntimeConfig | undefined;
}

export const setRuntimeConfig = (runtimeConfig: WebRuntimeConfig): void => {
  globalThis.__BOILERPLATE_RUNTIME_CONFIG__ = runtimeConfig;
};

export const hasRuntimeConfig = (): boolean =>
  globalThis.__BOILERPLATE_RUNTIME_CONFIG__ !== undefined;

function buildFromProcessEnv(): WebRuntimeConfig {
  return {
    env: {
      NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
      NEXT_PUBLIC_APP_TITLE_ICON: process.env.NEXT_PUBLIC_APP_TITLE_ICON,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_VERSION_PATH: process.env.NEXT_PUBLIC_API_VERSION_PATH,
      NEXT_PUBLIC_AUTH_MODE: process.env.NEXT_PUBLIC_AUTH_MODE,
      NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS: process.env.NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS,
      NEXT_PUBLIC_WEB_APP_URL: process.env.NEXT_PUBLIC_WEB_APP_URL,
      NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
      NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
      API_BACKEND_URL: process.env.API_BACKEND_URL,
    },
  };
}

export const getRuntimeConfig = (): WebRuntimeConfig => {
  const runtimeConfig = globalThis.__BOILERPLATE_RUNTIME_CONFIG__;
  if (runtimeConfig !== undefined) {
    return runtimeConfig;
  }
  return buildFromProcessEnv();
};
