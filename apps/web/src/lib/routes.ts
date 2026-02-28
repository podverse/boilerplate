/**
 * App route paths. Use these constants for navigation and links instead of hardcoded strings.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}
