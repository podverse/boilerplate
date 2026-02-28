/**
 * Shared request helper. All API request modules use this for consistent
 * behavior (base URL, auth header, JSON, error shape).
 */
export type ApiError = { status: number; message: string };

export type ApiResponse<T = unknown> =
  | { ok: true; status: number; data?: T }
  | { ok: false; status: number; error: ApiError };

export type RequestOptions = RequestInit & { token?: string | null };

export async function request(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse> {
  const { token, ...init } = options;
  const trimmedBase = baseUrl.replace(/\/$/, '');
  const pathPart = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${trimmedBase}${pathPart}`;
  const headers = new Headers(init.headers);
  if (token !== undefined && token !== null && token !== '') {
    headers.set('Authorization', `Bearer ${token}`);
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

  return { ok: true, status: res.status, data };
}
