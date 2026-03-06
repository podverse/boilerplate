/**
 * Client-only helpers for persisting table sort preferences in a cookie.
 * Cookie value is a JSON object keyed by list identifier; each value is { sortBy, sortOrder }.
 */

const COOKIE_MAX_AGE_DAYS = 365;
const COOKIE_PATH = '/';

export type SortPref = {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

type SortPrefsMap = Record<string, SortPref>;

function isClient(): boolean {
  return typeof document !== 'undefined';
}

function parseCookieValue(value: string): SortPrefsMap | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    return parsed as SortPrefsMap;
  } catch {
    return null;
  }
}

function isValidSortOrder(order: string): order is 'asc' | 'desc' {
  return order === 'asc' || order === 'desc';
}

export function getSortPrefsFromCookie(cookieName: string, listKey: string): SortPref | null {
  if (!isClient()) return null;
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + encodeURIComponent(cookieName) + '=([^;]*)')
  );
  const value = match?.[1];
  if (value === undefined) return null;
  try {
    const decoded = decodeURIComponent(value);
    const map = parseCookieValue(decoded);
    if (map === null) return null;
    const pref = map[listKey];
    if (
      pref === undefined ||
      typeof pref.sortBy !== 'string' ||
      pref.sortBy.trim() === '' ||
      !isValidSortOrder(pref.sortOrder)
    ) {
      return null;
    }
    return { sortBy: pref.sortBy.trim(), sortOrder: pref.sortOrder };
  } catch {
    return null;
  }
}

export function setSortPrefInCookie(
  cookieName: string,
  listKey: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): void {
  if (!isClient()) return;
  const existing = getSortPrefsMapFromCookie(cookieName);
  const next: SortPrefsMap = { ...existing, [listKey]: { sortBy, sortOrder } };
  const value = encodeURIComponent(JSON.stringify(next));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie =
    encodeURIComponent(cookieName) +
    '=' +
    value +
    '; path=' +
    COOKIE_PATH +
    '; max-age=' +
    maxAge +
    '; SameSite=Lax';
}

function getSortPrefsMapFromCookie(cookieName: string): SortPrefsMap {
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + encodeURIComponent(cookieName) + '=([^;]*)')
  );
  const value = match?.[1];
  if (value === undefined) return {};
  try {
    const decoded = decodeURIComponent(value);
    const map = parseCookieValue(decoded);
    return map !== null ? map : {};
  } catch {
    return {};
  }
}
