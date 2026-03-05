import type { UserWithRelations } from '@boilerplate/orm';

/**
 * Safe shape for user in API responses. Only these fields may be returned.
 * Never include credentials (e.g. passwordHash).
 */
export interface PublicUser {
  id: string;
  shortId: string;
  email: string;
  displayName: string | null;
}

/**
 * Serialize user for responses. Returns only safe, non-sensitive fields.
 */
export function userToJson(user: UserWithRelations): PublicUser {
  return {
    id: user.id,
    shortId: user.shortId,
    email: user.credentials.email,
    displayName: user.bio?.displayName ?? null,
  };
}
