import { getRuntimeConfig } from '../config/runtime-config-store';

const API_VERSION = '/v1';

export function getApiBaseUrl(): string {
  const base = getRuntimeConfig().env.NEXT_PUBLIC_API_URL ?? '';
  const trimmed = base.replace(/\/$/, '');
  return trimmed + API_VERSION;
}
