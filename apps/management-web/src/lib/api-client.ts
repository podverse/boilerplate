import { getManagementApiUrl } from '../config/env';

const API_VERSION = '/v1';

export function getApiBaseUrl(): string {
  return getManagementApiUrl() + API_VERSION;
}
