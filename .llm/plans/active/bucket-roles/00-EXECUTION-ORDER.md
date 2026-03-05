# Bucket roles – execution order

## Phase 1: Data and backend (sequential)

1. **01** – Predefined roles constant + types (e.g. in `packages/helpers` or `packages/management-orm`).
2. **02** – DB: add `bucket_role` table (init_database.sql + migration if used); ORM entity
   `BucketRole` and `BucketRoleService`.
3. **03** – Management-api: bucket roles routes, controller, Joi schemas, OpenAPI.

## Phase 2: Client wiring and management-web (after Phase 1)

4. **04** – Helpers-requests: bucket roles API helpers and types.
5. **05** – Management-web: routes (Roles tab, role new/edit); BucketSettingsTabs extended for
   Roles; bucket settings page `tab=roles` + BucketRolesClient; role create and edit pages.

## Phase 3: UI role selector (after Phase 2)

6. **06** – UI: BucketAdminsView → role dropdown (predefined + custom + "Create new role…");
   remove inline CrudCheckboxes from add-admin flow.
7. **07** – UI: Edit admin flow → role dropdown; remove permission checkboxes from edit form.

## Phase 4: Skill, tests, docs (can overlap)

8. **08** – Skill: `.cursor/skills/roles-schema-sync/SKILL.md`.
9. **09** – API tests for bucket roles; optional E2E; update `docs/buckets/OWNER-AND-ADMINS.md`.
