import type { ManagementWebRuntimeConfig } from './runtime-config';

declare global {
  var __BOILERPLATE_MANAGEMENT_RUNTIME_CONFIG__: ManagementWebRuntimeConfig | undefined;
}

export const setRuntimeConfig = (runtimeConfig: ManagementWebRuntimeConfig): void => {
  globalThis.__BOILERPLATE_MANAGEMENT_RUNTIME_CONFIG__ = runtimeConfig;
};

export const hasRuntimeConfig = (): boolean =>
  globalThis.__BOILERPLATE_MANAGEMENT_RUNTIME_CONFIG__ !== undefined;

function buildFromProcessEnv(): ManagementWebRuntimeConfig {
  return {
    env: {
      NEXT_PUBLIC_MANAGEMENT_API_URL: process.env.NEXT_PUBLIC_MANAGEMENT_API_URL,
      NEXT_PUBLIC_MANAGEMENT_API_VERSION_PATH: process.env.NEXT_PUBLIC_MANAGEMENT_API_VERSION_PATH,
      NEXT_PUBLIC_MANAGEMENT_SESSION_REFRESH_INTERVAL_MS:
        process.env.NEXT_PUBLIC_MANAGEMENT_SESSION_REFRESH_INTERVAL_MS,
      NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
      NEXT_PUBLIC_APP_TITLE_ICON: process.env.NEXT_PUBLIC_APP_TITLE_ICON,
      NEXT_PUBLIC_WEB_APP_URL: process.env.NEXT_PUBLIC_WEB_APP_URL,
      DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
      SUPPORTED_LOCALES: process.env.SUPPORTED_LOCALES,
      MANAGEMENT_API_BACKEND_URL: process.env.MANAGEMENT_API_BACKEND_URL,
    },
  };
}

export const getRuntimeConfig = (): ManagementWebRuntimeConfig => {
  const runtimeConfig = globalThis.__BOILERPLATE_MANAGEMENT_RUNTIME_CONFIG__;
  if (runtimeConfig !== undefined) {
    return runtimeConfig;
  }
  return buildFromProcessEnv();
};
