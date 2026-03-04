/**
 * App route paths. Use these constants for navigation and links instead of hardcoded strings.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BUCKETS: '/buckets',
  BUCKETS_NEW: '/buckets/new',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

export function bucketDetailRoute(id: string): string {
  return `/buckets/${id}`;
}

export function bucketEditRoute(id: string): string {
  return `/buckets/${id}/edit`;
}

export type BucketSettingsTab = 'general' | 'admins';

export function bucketSettingsRoute(id: string, tab?: BucketSettingsTab): string {
  const base = `/buckets/${id}/settings`;
  if (tab === 'admins') return `${base}?tab=admins`;
  return base;
}

/** Settings page with Admins tab selected. Use for "back to admins" from edit page. */
export function bucketSettingsAdminsRoute(id: string): string {
  return bucketSettingsRoute(id, 'admins');
}

export function bucketSettingsAdminEditRoute(bucketId: string, userId: string): string {
  return `/buckets/${bucketId}/settings/admins/${userId}/edit`;
}

export function bucketMessagesRoute(id: string): string {
  return `/buckets/${id}/messages`;
}

/** Public bucket page (no auth). */
export function publicBucketRoute(id: string): string {
  return `/b/${id}`;
}

export function publicBucketSubmitRoute(id: string): string {
  return `/b/${id}/submit`;
}

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

/** Public bucket view and submit live under /b/[id] and /b/[id]/submit. */
/** Admin invitation accept/decline page (login required to act, but page is public). */
export function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/b/') || pathname.startsWith('/invite/')
  );
}

export function inviteRoute(token: string): string {
  return `/invite/${token}`;
}
