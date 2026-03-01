# Management FTS: simple config + prefix matching

**Started:** 2026-02-28  
**Context:** Switch management FTS from `english` to `simple` and add prefix matching so e.g. "run" matches "running"/"runner" without language-specific stemming.

---

### Session 2 - 2026-02-28

#### Prompt (Developer)

revert all of the FTS related code in boilerplate and just use simple ILIKE

#### Key Decisions

- Removed `buildSimplePrefixTsquery` and all FTS (`to_tsvector`/`to_tsquery`) usage; replaced with `ILIKE :searchPattern` using `%term%` pattern.
- `ManagementUserService.listAdminsPaginated`: searches `credentials.email` and `bio.display_name` via ILIKE.
- `ManagementEventService.findEventsWithVisibility`: searches `action`, `actor_type`, `target_type`, `target_id`, `details` via ILIKE with COALESCE for nullable columns.
- Deleted `packages/management-orm/src/fts-utils.ts`.
- Rewrote `0006_fts_indexes.sql` to `DROP INDEX IF EXISTS` for the three FTS GIN indexes (they serve no purpose with ILIKE).
- Regenerated `init_management_database.sql` via `scripts/database/combine-migrations.sh`.

#### Files Created/Modified

- `packages/management-orm/src/fts-utils.ts` – deleted
- `packages/management-orm/src/services/ManagementUserService.ts` – FTS replaced with ILIKE
- `packages/management-orm/src/services/ManagementEventService.ts` – FTS replaced with ILIKE
- `infra/management-database/migrations/0006_fts_indexes.sql` – now drops the FTS GIN indexes
- `infra/management-database/combined/init_management_database.sql` – regenerated

### Session 1 - 2026-02-28

#### Prompt (Developer)

implement the changes you recommend

#### Key Decisions

- Added `buildSimplePrefixTsquery()` in `packages/management-orm/src/fts-utils.ts`: escape tsquery-special chars, split on whitespace, append `:*`, join with `&`; return empty string when no valid tokens so callers skip FTS condition.
- ManagementUserService and ManagementEventService use `to_tsvector('simple', ...)` and `to_tsquery('simple', :ftsQuery)` with the built string (parameterized).
- New migration 0007_fts_indexes_simple.sql: drop 0006 FTS indexes, recreate with `simple`; combined init SQL regenerated via scripts/database/combine-migrations.sh.

#### Files Created/Modified

- `packages/management-orm/src/fts-utils.ts` – new helper
- `packages/management-orm/src/services/ManagementUserService.ts` – FTS uses simple + prefix
- `packages/management-orm/src/services/ManagementEventService.ts` – FTS uses simple + prefix
- `infra/management-database/migrations/0007_fts_indexes_simple.sql` – new migration
- `infra/management-database/combined/init_management_database.sql` – regenerated
