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

async function trySessionRestore(
  request: NextRequest
): Promise<{ response: NextResponse; hasRestoredSession: boolean }> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const refreshCookie = request.cookies.get(REFRESH_COOKIE_NAME);
  if (sessionCookie === undefined && refreshCookie === undefined) {
    return { response: NextResponse.next(), hasRestoredSession: false };
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const baseUrl = getApiBaseUrl();
  const versionPath = getApiVersionPath();
  if (baseUrl === versionPath || baseUrl === '') {
    return { response: NextResponse.next(), hasRestoredSession: false };
  }

  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (meRes.status === 200) {
    return { response: NextResponse.next(), hasRestoredSession: false };
  }
  if (meRes.status !== 401) {
    return { response: NextResponse.next(), hasRestoredSession: false };
  }

  const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (refreshRes.status !== 200) {
    return { response: NextResponse.next(), hasRestoredSession: false };
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
    return { response: NextResponse.next(), hasRestoredSession: false };
  }
  const user = body?.user;
  if (user === undefined || typeof user.id !== 'string' || typeof user.email !== 'string') {
    return { response: NextResponse.next(), hasRestoredSession: false };
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
  return { response: nextRes, hasRestoredSession: true };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, and _next internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const { response, hasRestoredSession } = await trySessionRestore(request);
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME) || hasRestoredSession;
  const isPublic = isPublicPath(pathname);

  // Protected route without session -> redirect to login
  if (!isPublic && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
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
