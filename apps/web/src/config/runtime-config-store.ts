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
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_TITLE_ICON: process.env.NEXT_PUBLIC_APP_TITLE_ICON,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
