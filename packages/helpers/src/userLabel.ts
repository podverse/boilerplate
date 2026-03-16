/**
 * User display shape for formatUserLabel (username-first, then email fallback).
 */
export type UserLabelInput = {
  username?: string | null;
  email?: string | null;
  displayName?: string | null;
};

/**
 * Format a user for display: "username (displayName)" or "username"; fallback to
 * "email (displayName)" or "email" when username is not set. Returns "—" when
 * neither username nor email is set.
 */
export function formatUserLabel(user: UserLabelInput): string {
  const username =
    user.username !== undefined && user.username !== null && user.username !== ''
      ? user.username.trim()
      : null;
  const email =
    user.email !== undefined && user.email !== null && user.email !== '' ? user.email.trim() : null;
  const displayName =
    user.displayName !== undefined && user.displayName !== null && user.displayName !== ''
      ? user.displayName.trim()
      : null;

  const primary = username ?? email;
  if (primary === null) return '—';
  if (displayName !== null) return `${primary} (${displayName})`;
  return primary;
}
