import { request } from '../request.js';
import type { ApiError } from '../request.js';
import type { ListAdminsData } from '../types/management-admin-types.js';

/** Token optional; omit for cookie auth (credentials: 'include'). */
export async function list(
  baseUrl: string,
  token?: string | null
): Promise<{
  ok: boolean;
  status: number;
  data?: ListAdminsData;
  error?: ApiError;
}> {
  return request<ListAdminsData>(baseUrl, '/admins', { token: token ?? undefined });
}
