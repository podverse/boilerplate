import type { WebRuntimeConfig } from './runtime-config';

const getRuntimeConfigUrl = (): string => {
  const url = process.env.RUNTIME_CONFIG_URL;
  if (url === undefined || url === null || url === '') {
    throw new Error('Missing RUNTIME_CONFIG_URL for runtime config sidecar.');
  }
  return url.replace(/\/$/, '');
};

let cachedRuntimeConfig: Promise<WebRuntimeConfig> | null = null;

const fetchUncached = async (): Promise<WebRuntimeConfig> => {
  const baseUrl = getRuntimeConfigUrl();
  const response = await fetch(`${baseUrl}/runtime-config`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Runtime config sidecar returned ${response.status}.`);
  }
  const runtimeConfig: WebRuntimeConfig = await response.json();
  return runtimeConfig;
};

export const fetchWebRuntimeConfigFromSidecar = async (): Promise<WebRuntimeConfig> => {
  if (cachedRuntimeConfig !== null) {
    return cachedRuntimeConfig;
  }
  cachedRuntimeConfig = fetchUncached();
  return cachedRuntimeConfig;
};
