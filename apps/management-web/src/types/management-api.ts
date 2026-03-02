/**
 * Types for management API responses. Keep in sync with the API contract
 * (e.g. OpenAPI schema in apps/management-api).
 */

/** Event visibility for admin permissions: own, all_admins, or all. */
export type EventVisibility = 'own' | 'all_admins' | 'all';

/** CRUD bitmask: create=1, read=2, update=4, delete=8. Value 0–15. */
export type ManagementUserPermissions = {
  adminsCrud: number;
  usersCrud: number;
  canChangePasswords: boolean;
  canAssignPermissions: boolean;
  eventVisibility: EventVisibility;
};

/** User returned from GET /auth/me and POST /auth/login (and related admin endpoints). */
export type ManagementUser = {
  id: string;
  email: string;
  /** Required and unique for admins. */
  displayName: string;
  isSuperAdmin?: boolean;
  createdAt?: string;
  createdBy?: string | null;
  /** Omitted for super admin; present for admins. */
  permissions?: ManagementUserPermissions | null;
};

/** Event returned from GET /events. */
export type ManagementEvent = {
  id: string;
  actorId: string;
  actorType: string;
  actorDisplayName?: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  timestamp: string;
  details: string | null;
};
