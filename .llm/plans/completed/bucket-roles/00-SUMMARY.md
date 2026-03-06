# Bucket roles – summary

**Completed:** 2026-03-05. All phases (01–05) implemented: predefined and custom roles, bucket_role table and ORM, management-api roles CRUD, Roles tab and role new/edit pages, role dropdown on add/edit admin, helpers-requests, roles-schema-sync skill, API tests, OWNER-AND-ADMINS.md.

## Scope

Introduce **roles** (predefined and bucket-scoped custom) for bucket admin permissions. Admins
select a role when adding or editing a bucket admin; permission selectors live only on the
bucket-specific create/edit role pages. Add a **Roles** tab to bucket settings and a skill to
remind that roles may need updates when DB schema or permission dimensions change.

## Current state

- Bucket admins and invitations store `bucket_crud`, `message_crud`, `admin_crud` (0–15 each).
- Bucket settings has **General** and **Admins** tabs. Add admin uses three CrudCheckboxes; edit
  admin uses the same.

## Target behavior

- **Predefined roles**: Full, No update, No delete, Read only (in code; same for all buckets).
- **Custom roles**: Stored in new `bucket_role` table; create/edit on dedicated role pages.
- **Bucket settings tabs**: General | Admins | **Roles**. Roles tab lists predefined (read-only)
  and custom roles (edit/delete); "Create role" → role create page.
- **Add/Edit admin**: Role dropdown only (predefined + custom + "Create new role…"); no
  permission checkboxes on bucket settings. "Create new role" → role create page → return URL
  back to admins.
- **Skill**: When changing DB schema or permission dimensions, consider predefined roles and
  `bucket_role` / role-related code.

## Key files

- DB: `infra/database/combined/init_database.sql` (add `bucket_role`).
- ORM: `packages/orm` (BucketRole entity, BucketRoleService).
- API: `apps/management-api` (bucket roles routes, controller, schemas).
- UI: `packages/ui` (BucketAdminsView → role dropdown; BucketSettingsTabs → Roles; role form).
- Web: `apps/management-web` (routes, bucket settings page, role new/edit pages, BucketRolesClient).
- Skill: `.cursor/skills/roles-schema-sync/SKILL.md`.

## Execution order

See `00-EXECUTION-ORDER.md`.
