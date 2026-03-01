import { request } from '../request.js';
import type { ApiError } from '../request.js';

export type AuthResponse = Promise<{
  ok: boolean;
  status: number;
  data?: unknown;
  error?: ApiError;
}>;

/** Call /auth/me. Use token for Bearer (e.g. non-browser); omit for cookie auth. */
export async function me(baseUrl: string, token?: string | null): AuthResponse {
  return request(baseUrl, '/auth/me', { token: token ?? undefined });
}

export async function refresh(baseUrl: string): AuthResponse {
  return request(baseUrl, '/auth/refresh', { method: 'POST' });
}

export async function logout(baseUrl: string): AuthResponse {
  return request(baseUrl, '/auth/logout', { method: 'POST' });
}

export async function login(baseUrl: string, email: string, password: string): AuthResponse {
  return request(baseUrl, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
