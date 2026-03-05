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

/** Account settings tab; URL param ?tab= for profile, password, email. */
export type AccountSettingsTab = 'general' | 'profile' | 'password' | 'email';

export function accountSettingsRoute(tab?: AccountSettingsTab): string {
  const base = ROUTES.SETTINGS;
  if (tab === 'profile') return `${base}?tab=profile`;
  if (tab === 'password') return `${base}?tab=password`;
  if (tab === 'email') return `${base}?tab=email`;
  return base;
}

export function bucketDetailRoute(id: string): string {
  return `/bucket/${id}`;
}

export function bucketEditRoute(id: string): string {
  return `/bucket/${id}/edit`;
}

export type BucketSettingsTab = 'general' | 'admins';

export function bucketSettingsRoute(id: string, tab?: BucketSettingsTab): string {
  const base = `/bucket/${id}/settings`;
  if (tab === 'admins') return `${base}?tab=admins`;
  return base;
}

/** Settings page with Admins tab selected. Use for "back to admins" from edit page. */
export function bucketSettingsAdminsRoute(id: string): string {
  return bucketSettingsRoute(id, 'admins');
}

export function bucketSettingsAdminEditRoute(bucketId: string, userId: string): string {
  return `/bucket/${bucketId}/settings/admins/${userId}/edit`;
}

export function bucketMessagesRoute(id: string): string {
  return `/bucket/${id}/messages`;
}

export function bucketMessageEditRoute(bucketId: string, messageId: string): string {
  return `/bucket/${bucketId}/messages/${messageId}/edit`;
}

export function topicMessagesRoute(parentId: string, topicId: string): string {
  return `/bucket/${parentId}/topic/${topicId}/messages`;
}

export function topicMessageEditRoute(
  parentId: string,
  topicId: string,
  messageId: string
): string {
  return `/bucket/${parentId}/topic/${topicId}/messages/${messageId}/edit`;
}

export function topicDetailRoute(parentId: string, topicId: string): string {
  return `/bucket/${parentId}/topic/${topicId}`;
}

export function topicEditRoute(parentId: string, topicId: string): string {
  return `/bucket/${parentId}/topic/${topicId}/edit`;
}

export function topicNewRoute(parentId: string): string {
  return `/bucket/${parentId}/topic/new`;
}

/** Public bucket page (no auth). */
export function publicBucketRoute(id: string): string {
  return `/b/${id}`;
}

export function publicBucketSubmitRoute(id: string): string {
  return `/b/${id}/send-message`;
}

/** Public topic page (no auth); parentId is bucket id, topicId is topic bucket id. */
export function publicTopicRoute(parentId: string, topicId: string): string {
  return `/b/${parentId}/t/${topicId}`;
}

export function publicTopicSubmitRoute(parentId: string, topicId: string): string {
  return `/b/${parentId}/t/${topicId}/send-message`;
}

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

/** Public bucket view and send-message live under /b/[id] and /b/[id]/send-message. */
/** Admin invitation accept/decline page (login required to act, but page is public). */
export function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/b/') || pathname.startsWith('/invite/')
  );
}

export function inviteRoute(token: string): string {
  return `/invite/${token}`;
}
