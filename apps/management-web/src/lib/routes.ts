/**
 * App route paths. Use these constants for navigation and links instead of hardcoded strings.
 */
export const ROUTES = {
  HOME: '/dashboard',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMINS: '/admins',
  ADMINS_NEW: '/admins/new',
  EVENTS: '/events',
  USERS: '/users',
  USERS_NEW: '/users/new',
  BUCKETS: '/buckets',
  BUCKETS_NEW: '/buckets/new',
} as const;

export function adminViewRoute(id: string): string {
  return `/admin/${id}`;
}

export function adminEditRoute(id: string): string {
  return `/admin/${id}/edit`;
}

export function userViewRoute(id: string): string {
  return `/user/${id}`;
}

export function userEditRoute(id: string): string {
  return `/user/${id}/edit`;
}

export function bucketViewRoute(id: string): string {
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

/** Paths where unauthenticated users are allowed; 401 on these should not trigger redirect. */
export const PUBLIC_PATHS: readonly string[] = ['/', ROUTES.LOGIN];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}
