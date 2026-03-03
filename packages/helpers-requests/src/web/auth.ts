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

export async function login(baseUrl: string, email: string, password: string): AuthResponse {
  return request(baseUrl, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/** Call /auth/refresh to rotate cookies. No body; uses refresh cookie. */
export async function refresh(baseUrl: string): AuthResponse {
  return request(baseUrl, '/auth/refresh', { method: 'POST' });
}

export async function logout(baseUrl: string): AuthResponse {
  return request(baseUrl, '/auth/logout', { method: 'POST' });
}

export async function signup(
  baseUrl: string,
  body: { email: string; password: string; displayName?: string },
  options?: { locale?: string }
): AuthResponse {
  return request(baseUrl, '/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    locale: options?.locale,
  });
}

export async function forgotPassword(
  baseUrl: string,
  email: string,
  options?: { locale?: string }
): AuthResponse {
  return request(baseUrl, '/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    locale: options?.locale,
  });
}

export async function resetPassword(
  baseUrl: string,
  body: { token: string; newPassword: string },
  options?: { locale?: string }
): AuthResponse {
  return request(baseUrl, '/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
    locale: options?.locale,
  });
}

/** Call POST /auth/change-password (authenticated). Uses cookies by default. */
export async function changePassword(
  baseUrl: string,
  body: { currentPassword: string; newPassword: string },
  options?: { locale?: string; token?: string | null }
): AuthResponse {
  return request(baseUrl, '/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(body),
    locale: options?.locale,
    token: options?.token ?? undefined,
  });
}

/** Call PATCH /auth/me to update profile (display name, profile visibility). Uses cookies by default. */
export async function updateProfile(
  baseUrl: string,
  body: { displayName: string | null; profileVisibility?: boolean },
  options?: { token?: string | null }
): AuthResponse {
  return request(baseUrl, '/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
    token: options?.token ?? undefined,
  });
}

/** Call POST /auth/request-email-change (authenticated). Sends verification email. */
export async function requestEmailChange(
  baseUrl: string,
  body: { newEmail: string },
  options?: { locale?: string; token?: string | null }
): AuthResponse {
  return request(baseUrl, '/auth/request-email-change', {
    method: 'POST',
    body: JSON.stringify(body),
    locale: options?.locale,
    token: options?.token ?? undefined,
  });
}
