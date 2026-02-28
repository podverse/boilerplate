import { request } from '../request.js';

/** Token optional; omit for cookie auth (credentials: 'include'). */
export async function list(
  baseUrl: string,
  token?: string | null
): Promise<{ ok: boolean; status: number; data?: unknown; error?: { status: number; message: string } }> {
  return request(baseUrl, '/admins', { token: token ?? undefined });
}
