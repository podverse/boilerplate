# E2E User Context String Consistency

**Started:** 2025-03-10  
**Context:** Plan at .llm/plans/active/e2e-user-context-consistency.md

---

### Session 1 - 2025-03-10

#### Prompt (Developer)

implement the plan

#### Key Decisions

- Reporter normalization: added colon → hyphen so suffixes like `admin (admins users events:own)` become CSS-safe `admin-admins-users-events-own`.
- KNOWN_USER_CONTEXT_KEYS: added bucket-admin, admin-admins-users-events-own, admin-buckets-r-bucket-admins-events-all-admins, admin-buckets-r-events-all-admins; removed super-admin-full-crud and limited-admin-users-read.
- e2e-readability skill: "User context in reports" rewritten to document role/permissions pattern, web vs management-web, shorthand (resource name = full CRUD, resource:R = read-only), good/avoid examples; version 1.2.0.

#### Files Created/Modified

- scripts/e2e-html-steps-reporter.ts — userContextToClassSuffix (colon→hyphen), KNOWN_USER_CONTEXT_KEYS, CSS for new keys
- .cursor/skills/e2e-readability/SKILL.md — User context in reports section, version 1.2.0
- docs/testing/E2E-SPEC-REPORT-COMMANDS.md — user context paragraph aligned with pattern
- apps/management-web/e2e/users-super-admin-full-crud.spec.ts — 'super-admin' → 'super-admin' (4)
- apps/management-web/e2e/user-detail-super-admin-full-crud.spec.ts — 'super-admin' → 'super-admin' (3)
- apps/management-web/e2e/user-detail-limited-admin-users-read.spec.ts — 'limited-admin (users read)' → 'admin (admins users events:own)' (3)
- apps/management-web/e2e/users-limited-admin-users-read.spec.ts — 'limited-admin (users read)' → 'admin (admins users events:own)' (2)
- .llm/history/active/e2e-user-context-consistency/e2e-user-context-consistency.md — created

---

### Session 2 - 2025-03-10

#### Prompt (Developer)

change web to use a strict resource level pattern format so both web and mgmt web are consistent in this respect and update skill if needed

#### Key Decisions

- Web now uses the same resource/level notation as management-web: resource name only = full CRUD, `resource:R` = read-only, `resource:-` = no access.
- Web resources (bucket-scoped): settings, roles, messages, admins, bucket, bucket_create.
- Canonical strings: `bucket-admin (settings:- roles:- messages:- admins:-)` for admin-without-permission; `bucket-admin (bucket:R bucket_create:-)` for read-only no create.
- Reporter unchanged (role-prefix coloring already maps bucket-admin (…) to bucket-admin color).

#### Files Created/Modified

- apps/web/e2e/bucket-settings-admin-without-permission.spec.ts
- apps/web/e2e/bucket-role-new-admin-without-permission.spec.ts
- apps/web/e2e/bucket-role-edit-admin-without-permission.spec.ts
- apps/web/e2e/bucket-admin-edit-admin-without-permission.spec.ts
- apps/web/e2e/bucket-message-edit-admin-without-permission.spec.ts
- apps/web/e2e/bucket-nested-new-non-owner-admin-read-only-no-create.spec.ts
- apps/web/e2e/bucket-child-new-non-owner-admin-read-only-no-create.spec.ts
- .llm/plans/completed/e2e-user-context-consistency.md — web resources + Full mapping table
- .cursor/skills/e2e-readability/SKILL.md — web bullet: same resource/level notation, examples
