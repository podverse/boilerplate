import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { PUBLIC_PATHS, ROUTES } from './lib/routes';

const SESSION_COOKIE_NAME = 'management_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, and _next internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  // Protected route without session cookie -> redirect to login
  if (!isPublic && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Do not redirect away from login/signup here. A stale or invalid session cookie
  // would cause a loop: proxy sends /login -> dashboard, then getServerUser() fails
  // and dashboard redirects to /login. Let the login/signup pages and API handle
  // validity; they redirect to dashboard only when the session is actually valid.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
