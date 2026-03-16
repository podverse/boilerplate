# E2E specs split by user

**Started:** 2025-03-09  
**Context:** Plan "E2E spec files: split by user and rename" — one user/actor per spec file, naming `<feature>-<user>.spec.ts`.

---

### Session 1 - 2025-03-09

#### Prompt (Developer)

E2E spec files: split by user and rename. Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Web e2e: all 22 specs split or renamed so each file tests exactly one actor (unauthenticated, seeded-bucket-owner, etc.). User segment in filename: lowercase, spaces/commas/parens → hyphens (e.g. super-admin-full-crud).
- Management-web e2e: all 26 specs split by user; same filename convention (e.g. bucket-admin-edit-unauthenticated.spec.ts, bucket-admin-edit-super-admin-full-crud.spec.ts).
- Helpers and Playwright config unchanged. Alignment plan and Makefile examples updated to reference per-user spec naming.

#### Files Created/Modified

- apps/web/e2e: replaced multi-actor specs with per-actor files (e.g. settings-unauthenticated.spec.ts, settings-seeded-bucket-owner.spec.ts); renamed send-message, signup, forgot-password, reset-password to *-unauthenticated.spec.ts; split login into login-unauthenticated, login-seeded-bucket-owner.
- apps/management-web/e2e: replaced all 26 specs with per-actor files (dashboard, home, login, profile, settings, events, buckets, buckets-new, bucket-settings, bucket-admin-edit, bucket-detail, bucket-edit, bucket-messages, bucket-message-edit, bucket-role-edit, bucket-role-new, bucket-child-new, admin-edit, admin-detail, admin-role-new, admins, admins-new, user-edit, user-detail, users, users-new).
- .llm/plans/active/e2e-crud-permission-permutations-alignment.md: added note that specs are split by user; updated table column to "Feature (specs: <feature>-<user>.spec.ts)"; updated reference links.
- makefiles/local/Makefile.local.e2e.mk: updated SPEC examples to use per-user names (e.g. e2e/buckets-unauthenticated.spec.ts).
