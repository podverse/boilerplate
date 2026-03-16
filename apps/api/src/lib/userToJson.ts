import type { UserWithRelations } from '@boilerplate/orm';

/**
 * Safe shape for user in API responses. Only these fields may be returned.
 * Never include credentials (e.g. passwordHash).
 * Email and username are optional (at least one is set in DB; legacy or username-only users).
 */
export interface PublicUser {
  id: string;
  shortId: string;
  email: string | null;
  username: string | null;
  displayName: string | null;
}

/**
 * Serialize user for responses. Returns only safe, non-sensitive fields.
 */
export function userToJson(user: UserWithRelations): PublicUser {
  return {
    id: user.id,
    shortId: user.shortId,
    email: user.credentials.email ?? null,
    username: user.credentials.username ?? null,
    displayName: user.bio?.displayName ?? null,
  };
}
