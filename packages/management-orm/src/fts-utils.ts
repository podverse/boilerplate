/**
 * Builds a PostgreSQL tsquery string for prefix matching using the 'simple' config.
 * No language-specific stemming; e.g. "run" matches "run", "running", "runner".
 * Escapes tsquery-special characters so user input is safe to pass to to_tsquery('simple', ...).
 * Returns empty string when there are no valid tokens (caller should skip FTS condition).
 */
export function buildSimplePrefixTsquery(search: string): string {
  const trimmed = search.trim();
  if (trimmed === '') return '';
  const tokens = trimmed
    .split(/\s+/)
    .map((t) =>
      t
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "''")
        .replace(/[:!&|()]/g, '')
    )
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return '';
  return tokens.map((t) => `${t}:*`).join(' & ');
}
