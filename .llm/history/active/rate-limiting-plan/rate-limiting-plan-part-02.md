# Rate limiting plan (added to boilerplate plans) — Part 02

**Started:** 2026-03-01
**Context:** Continuation of rate-limiting plan implementation; fixing remaining test failures.

---

### Session 11 - 2026-03-01

#### Prompt (Developer)

Fix Remaining Test Failures

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Fixed `reject_direct_delete_user_credentials` DB trigger to allow cascade-triggered deletes using `pg_trigger_depth() > 0` check; previously it fired unconditionally blocking `DELETE /users/:id`.
- Extracted management API rate-limit test into its own isolated file (`management-api-rate-limit.test.ts`) so it starts with a fresh MemoryStore and no prior login calls polluting the counter.

#### Files Created/Modified

- infra/database/migrations/0003_user_credentials_integrity.sql
- infra/database/combined/init_database.sql
- apps/management-api/src/test/management-api-rate-limit.test.ts (new)
- apps/management-api/src/test/management-users-permissions.test.ts (removed rate-limit describe block)

---

### Session 12 - 2026-03-01

#### Prompt (Developer)

Remove DB Integrity Triggers

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Removed deferred creation constraint triggers (`ensure_user_has_credentials`, `ensure_management_user_has_cred_and_bio`) and the direct-delete guard (`prevent_direct_delete_user_credentials`/`reject_direct_delete_user_credentials`) — all redundant with FK ON DELETE CASCADE and application-layer transaction atomicity.
- Migration files edited in-place (comment-only) since schema is always applied on a clean slate.
- Combined SQL regenerated via `scripts/database/combine-migrations.sh`.
- Removed `SET CONSTRAINTS ... DEFERRED` calls from `UserService.create()` and `ManagementUserService.createAdmin()`.

#### Files Created/Modified

- infra/database/migrations/0003_user_credentials_integrity.sql
- infra/database/combined/init_database.sql
- infra/management-database/migrations/0005_management_user_cred_bio_integrity.sql
- infra/management-database/combined/init_management_database.sql
- packages/orm/src/services/UserService.ts
- packages/management-orm/src/services/ManagementUserService.ts

---

### Session 13 - 2026-03-01

#### Prompt (Developer)

if any migrations files are just comments, those files are stale and should just be removed

#### Key Decisions

- Deleted the two comment-only migration stubs left over from Session 12 since the schema is always applied on a clean slate and empty migration files serve no purpose.
- Regenerated combined SQL after deletion.

#### Files Created/Modified

- infra/database/migrations/0003_user_credentials_integrity.sql (deleted)
- infra/database/combined/init_database.sql
- infra/management-database/migrations/0005_management_user_cred_bio_integrity.sql (deleted)
- infra/management-database/combined/init_management_database.sql
