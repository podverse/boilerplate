/**
 * App route paths. Use these constants for navigation and links instead of hardcoded strings.
 */
export const ROUTES = {
  HOME: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  ADMINS: '/admins',
  EVENTS: '/events',
} as const;

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = [
  '/',
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}
