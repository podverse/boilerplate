### Session 1 - 2026-03-10

#### Prompt (Developer)

Repository: /Users/mitcheldowney/repos/pv/boilerplate
Task: Sweep and rename legacy unprefixed bucket-message CRUD names to prefixed names in active code/docs, then remove legacy note from .cursor/skills/roles-schema-sync/SKILL.md.

Target renames:
- messageCrud -> bucketMessagesCrud
- message_crud -> bucket_messages_crud
- messagePermissions label keys/variables should become bucketMessagesPermissions only when they refer to permission field naming, but keep user-facing "Messages" text where context is page-local and not global permission schema naming.

Scope:
- Include active source, tests, schemas, openapi, helpers, orm entities/services, SQL init/migrations, docs/skills.
- Exclude .llm/history and .llm/plans files from edits.

Constraints:
- Keep TypeScript strict and existing style.
- Avoid type assertions where possible.
- Update related payload/type names and API schema fields consistently so compile contracts align.
- If a rename requires touching many files, do it comprehensively rather than partially.

Required verification before finishing:
1) Search for remaining unprefixed names in non-.llm files (messageCrud/message_crud/messagesCrud/messages_crud) and ensure none remain except intentional plain-English text where not schema/field names.
2) Run targeted lint diagnostics for changed files.
3) Return a concise list of changed files and any residual intentionally-kept occurrences.

#### Key Decisions

- Renamed permission schema/API/type fields from `messageCrud` to `bucketMessagesCrud` across API, management-api, web, management-web, helpers, ORM, and UI layers.
- Renamed SQL column naming from `message_crud` to `bucket_messages_crud` in active init/migration docs and seed SQL inserts.
- Renamed permission-label key usage from `messagePermissions` to `bucketMessagesPermissions` while preserving user-facing "Message permissions" copy text.
- Removed the legacy-unprefixed note from `roles-schema-sync` and eliminated remaining unprefixed examples from active skill/docs where they represented schema field names.

#### Files Modified

- `.cursor/skills/roles-schema-sync/SKILL.md`
- `.cursor/skills/nested-resource-prefix-naming/SKILL.md`
- `apps/api/src/controllers/bucketAdminsController.ts`
- `apps/api/src/controllers/bucketRolesController.ts`
- `apps/api/src/controllers/bucketAdminInvitationsController.ts`
- `apps/api/src/lib/bucket-admin-permissions.ts`
- `apps/api/src/lib/bucket-policy.ts`
- `apps/api/src/schemas/buckets.ts`
- `apps/management-api/src/controllers/bucketAdminsController.ts`
- `apps/management-api/src/controllers/bucketRolesController.ts`
- `apps/management-api/src/controllers/bucketAdminInvitationsController.ts`
- `apps/management-api/src/controllers/usersController.ts`
- `apps/management-api/src/lib/bucket-admin-permissions.ts`
- `apps/management-api/src/openapi.ts`
- `apps/management-api/src/schemas/buckets.ts`
- `apps/management-api/src/test/management-buckets-messages.test.ts`
- `apps/web/src/lib/bucket-authz.ts`
- `apps/web/src/lib/buckets.ts`
- `apps/web/src/app/(main)/bucket/[id]/BucketAdminsClient.tsx`
- `apps/web/src/app/(main)/bucket/[id]/BucketRoleFormClient.tsx`
- `apps/web/src/app/(main)/bucket/[id]/BucketRolesClient.tsx`
- `apps/web/src/app/(main)/bucket/[id]/EditBucketAdminFormClient.tsx`
- `apps/web/src/app/(main)/bucket/[id]/settings/BucketSettingsContent.tsx`
- `apps/web/src/app/(main)/bucket/[id]/settings/admins/[userId]/edit/page.tsx`
- `apps/web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`
- `apps/web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`
- `apps/web/src/app/(main)/invite/[token]/InvitePageClient.tsx`
- `apps/web/e2e/helpers/advancedFixtures.ts`
- `apps/web/i18n/originals/en-US.json`
- `apps/web/i18n/originals/es.json`
- `apps/web/i18n/overrides/es.json`
- `apps/management-web/src/app/(main)/bucket/[id]/EditBucketAdminFormClient.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/BucketAdminsClient.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/BucketRolesClient.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/admins/[userId]/edit/page.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/BucketRoleFormClient.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`
- `apps/management-web/e2e/helpers/advancedFixtures.ts`
- `apps/management-web/i18n/originals/en-US.json`
- `apps/management-web/i18n/originals/es.json`
- `apps/management-web/i18n/overrides/es.json`
- `packages/helpers/src/bucketRoles/constants.ts`
- `packages/helpers-requests/src/bucketAdminRoleOptions.ts`
- `packages/helpers-requests/src/management-web/bucketAdmins.ts`
- `packages/helpers-requests/src/management-web/bucketRoles.ts`
- `packages/orm/src/entities/BucketAdmin.ts`
- `packages/orm/src/entities/BucketAdminInvitation.ts`
- `packages/orm/src/entities/BucketRole.ts`
- `packages/orm/src/services/BucketAdminService.ts`
- `packages/orm/src/services/BucketAdminInvitationService.ts`
- `packages/orm/src/services/BucketRoleService.ts`
- `packages/ui/src/components/bucket/BucketAdminsView/BucketAdminsView.tsx`
- `packages/ui/src/components/bucket/EditBucketAdminForm/EditBucketAdminForm.tsx`
- `infra/database/combined/init_database.sql`
- `infra/database/migrations/0003_bucket_schema.sql`
- `tools/web/seed-e2e.mjs`
- `docs/buckets/OWNER-AND-ADMINS.md`

### Session 2 - 2026-03-10

#### Prompt (Developer)

Bucket-Scoped Admin CRUD Prefix Rename

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Completed a full bucket-scoped rename sweep for `adminCrud`/`admin_crud` to `bucketAdminsCrud`/`bucket_admins_crud` across ORM, API, management-api, web, management-web, helpers, UI, docs, and SQL.
- Added a forward-compatible migration (`0004_bucket_admins_crud_rename.sql`) to rename legacy columns in existing databases where `admin_crud` still exists.
- Regenerated combined SQL via `scripts/database/combine-migrations.sh` after migration updates.
- Preserved management-admin permission semantics by keeping `adminsCrud` and existing management `bucketAdminsCrud` fields unchanged.
- Verification run note: targeted API test execution hit environment/setup blockers locally (test DB refresh command failed due Xcode license requirement), so full runtime verification could not be completed in this session.

#### Files Modified

- `infra/database/migrations/0004_bucket_admins_crud_rename.sql`
- `infra/database/combined/init_database.sql`
- `infra/management-database/combined/init_management_database.sql`
- Bucket-scoped rename updates across previously modified API, management-api, web, management-web, ORM, helper, UI, docs, and skill files in this feature sweep.

### Session 3 - 2026-03-10

#### Prompt (Developer)

@boilerplate/infra/database/migrations/0004_bucket_admins_crud_rename.sql:1-35 you do not need to alter table, instead handle in create table that already exists, assume green field db

#### Key Decisions

- Removed the additive rename migration and relied on the existing `CREATE TABLE` schema (`0003_bucket_schema.sql`) as the source of truth for greenfield databases.
- Regenerated combined SQL so `init_database.sql` no longer includes the removed migration.

#### Files Modified

- `infra/database/migrations/0004_bucket_admins_crud_rename.sql` (deleted)
- `infra/database/combined/init_database.sql`
