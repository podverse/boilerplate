import type { BearerToken } from './types/request-types.js';

/**
 * Shared request helper. All API request modules use this for consistent
 * behavior (base URL, auth header, JSON, error shape).
 */
export type ApiError = { status: number; message: string };

export type ApiResponse<T = unknown> =
  | { ok: true; status: number; data?: T }
  | { ok: false; status: number; error: ApiError };

export type RequestOptions = RequestInit & {
  token?: BearerToken;
  /** When set, sent as Accept-Language so the API can localize responses (e.g. emails, password validation). */
  locale?: string;
};

export async function request<T = unknown>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, locale, ...init } = options;
  const trimmedBase = baseUrl.replace(/\/$/, '');
  const pathPart = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${trimmedBase}${pathPart}`;
  const headers = new Headers(init.headers);
  if (token !== undefined && token !== null && token !== '') {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (locale !== undefined && locale !== null && locale !== '') {
    headers.set('Accept-Language', locale);
  }
  if (init.body !== undefined && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials ?? 'include',
  });
  let data: unknown;
  const contentType = res.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = undefined;
    }
  } else {
    data = undefined;
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : res.statusText || 'Request failed';
    return { ok: false, status: res.status, error: { status: res.status, message } };
  }

  // JSON parse returns unknown; caller supplies type via request<T>() for typed data
  return { ok: true, status: res.status, data: data as T };
}
