/**
 * App route paths. Use these constants for navigation and links instead of hardcoded strings.
 */
export const ROUTES = {
  HOME: '/dashboard',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  ADMINS: '/admins',
  ADMINS_NEW: '/admins/new',
  EVENTS: '/events',
} as const;

export function adminEditRoute(id: string): string {
  return `/admins/${id}/edit`;
}

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = ['/', ROUTES.LOGIN];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}
