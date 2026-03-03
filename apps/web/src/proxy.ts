import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isPublicPath, ROUTES } from './lib/routes';

const SESSION_COOKIE_NAME = 'session';
const REFRESH_COOKIE_NAME = 'refresh';
const AUTH_USER_HEADER = 'x-auth-user';

function getApiVersionPath(): string {
  const ver = process.env.NEXT_PUBLIC_API_VERSION_PATH?.trim();
  return ver && ver.startsWith('/') ? ver : '/v1';
}

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? '';
  const trimmed = base.replace(/\/$/, '');
  return trimmed + getApiVersionPath();
}

/** Clear session/refresh cookies (Path=/; Max-Age=0) so the client drops them. */
function appendClearSessionCookies(res: NextResponse): void {
  const opts = 'Path=/; Max-Age=0; HttpOnly; SameSite=lax';
  res.headers.append('Set-Cookie', `${SESSION_COOKIE_NAME}=; ${opts}`);
  res.headers.append('Set-Cookie', `${REFRESH_COOKIE_NAME}=; ${opts}`);
}

async function trySessionRestore(request: NextRequest): Promise<{
  response: NextResponse;
  hasRestoredSession: boolean;
  sessionInvalidated: boolean;
}> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const refreshCookie = request.cookies.get(REFRESH_COOKIE_NAME);
  if (sessionCookie === undefined && refreshCookie === undefined) {
    return { response: NextResponse.next(), hasRestoredSession: false, sessionInvalidated: false };
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const baseUrl = getApiBaseUrl();
  const versionPath = getApiVersionPath();
  if (baseUrl === versionPath || baseUrl === '') {
    return { response: NextResponse.next(), hasRestoredSession: false, sessionInvalidated: false };
  }

  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (meRes.status === 200) {
    return { response: NextResponse.next(), hasRestoredSession: false, sessionInvalidated: false };
  }
  if (meRes.status !== 401) {
    return { response: NextResponse.next(), hasRestoredSession: false, sessionInvalidated: false };
  }

  const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (refreshRes.status !== 200) {
    const res = NextResponse.next();
    appendClearSessionCookies(res);
    return { response: res, hasRestoredSession: false, sessionInvalidated: true };
  }

  let body: {
    user?: {
      id?: string;
      shortId?: string;
      email?: string;
      displayName?: string | null;
      profileVisibility?: boolean;
    };
  };
  try {
    body = (await refreshRes.json()) as typeof body;
  } catch {
    const res = NextResponse.next();
    appendClearSessionCookies(res);
    return { response: res, hasRestoredSession: false, sessionInvalidated: true };
  }
  const user = body?.user;
  if (user === undefined || typeof user.id !== 'string' || typeof user.email !== 'string') {
    const res = NextResponse.next();
    appendClearSessionCookies(res);
    return { response: res, hasRestoredSession: false, sessionInvalidated: true };
  }

  const authUser = JSON.stringify({
    id: user.id,
    shortId: typeof user.shortId === 'string' ? user.shortId : user.id,
    email: user.email,
    displayName: user.displayName ?? null,
    profileVisibility: user.profileVisibility === true,
  });
  const newHeaders = new Headers(request.headers);
  newHeaders.set(AUTH_USER_HEADER, authUser);
  const nextRes = NextResponse.next({ request: { headers: newHeaders } });
  const setCookies = refreshRes.headers.getSetCookie?.();
  if (Array.isArray(setCookies)) {
    for (const value of setCookies) {
      nextRes.headers.append('Set-Cookie', value);
    }
  }
  return { response: nextRes, hasRestoredSession: true, sessionInvalidated: false };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, and _next internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const { response, hasRestoredSession, sessionInvalidated } = await trySessionRestore(request);
  const hasSession =
    (request.cookies.has(SESSION_COOKIE_NAME) || hasRestoredSession) && !sessionInvalidated;
  const isPublic = isPublicPath(pathname);

  // Protected route without session -> redirect to login
  if (!isPublic && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    const redirectRes = NextResponse.redirect(loginUrl);
    if (sessionInvalidated) {
      appendClearSessionCookies(redirectRes);
    }
    return redirectRes;
  }

  // Already logged in visiting login/signup -> redirect to dashboard
  if (hasSession && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
    const dashboardUrl = new URL(ROUTES.DASHBOARD, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
