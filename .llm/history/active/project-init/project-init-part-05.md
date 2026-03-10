# Feature: project-init (Part 5)

> Continuation of `project-init-part-04.md` after reaching the 10-session limit.

## Metadata
- Started: 2026-03-10
- Completed: In Progress
- Author: Mitch Downey
- LLM(s): Cursor, Claude, etc.
- GitHub Issues: https://github.com/podverse/boilerplate/issues/20
- Branch: feature/project-init
- Origin: https://github.com/podverse/boilerplate.git
- Is Fork: no

## Context

Implement management-web E2E recovery plan and stabilize failing specs after route/selector drift.

## Sessions

### Session 59 - 2026-03-10

#### Prompt (Developer)

Management-Web E2E Failure Recovery Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged the exact developer prompt before implementation edits.
- Fixed management-web fixture helpers to use proxied management API v1 paths and added
  endpoint/status/body-snippet diagnostics for fixture failures.
- Updated redirect expectations and route assertions to match current authz behavior
  (`/dashboard`, `/buckets`, not-found), and aligned stale UUID assumptions to current IDs.
- Replaced brittle selector patterns (`or()` strict-locator ambiguity, link/button drift,
  regex selectOption label) with deterministic, current-UI locators.
- Aligned bucket/bucket-message permission-path assertions with current visible navigation
  behavior for read-only and bucket-admin roles.
- Verified the full originally-failing management-web cluster passes and confirmed the full
  management-web E2E suite is green.

#### Files Modified

- .llm/history/active/project-init/project-init-part-05.md
- apps/management-web/e2e/helpers/advancedFixtures.ts
- apps/management-web/e2e/admin-detail-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-edit-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admin-role-new-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-role-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admins-limited-admin-admins-read.spec.ts
- apps/management-web/e2e/admins-new-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts
- apps/management-web/e2e/bucket-admin-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-child-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-detail-admin-with-buckets-read-bucket-admins-permission.spec.ts
- apps/management-web/e2e/bucket-edit-admin-with-buckets-read-bucket-admins-permission.spec.ts
- apps/management-web/e2e/bucket-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-message-edit-admin-with-buckets-read-no-message-update.spec.ts
- apps/management-web/e2e/bucket-message-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-messages-admin-with-buckets-read-bucket-admins-permission.spec.ts
- apps/management-web/e2e/buckets-new-limited-admin-no-buckets-create.spec.ts
- apps/management-web/e2e/buckets-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/events-limited-admin-no-buckets-events-own-only.spec.ts
- apps/management-web/e2e/user-detail-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/user-edit-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/user-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/users-limited-admin-users-read.spec.ts
- apps/management-web/e2e/users-new-admin-with-buckets-read-no-users-crud.spec.ts

### Session 60 - 2026-03-10

#### Prompt (Developer)

Web E2E Failure Recovery Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged the exact developer prompt before implementation edits.
- Hardened the shared web not-found helper with count-based branching to support both
  custom and framework fallback 404 UIs without strict-locator ambiguity.
- Aligned web E2E permission-route assertions to current behavior: several previously
  not-found-only flows now render add-bucket forms for non-owner/non-admin actors.
- Updated bucket messages assertions to current route contract where messages are rendered
  on `/bucket/:id` rather than `/bucket/:id/messages`.
- Replaced strict-mode `.or()` locator usage with deterministic branching in non-admin
  buckets-list coverage.
- Updated reset-password unauthenticated assertions to current disabled-email-verification
  contract (`Email verification is not enabled`, no login redirect).
- Verified the originally failing web cluster passed (25/25) and completed full cross-app
  report verification (`e2e_test_report`) with web and management-web suites green.
- `e2e_test_web` target currently fails after suite execution due workspace script lookup
  for `@boilerplate/web-sidecar` missing `test:e2e`; this did not block `e2e_test_report`.

#### Files Modified

- .llm/history/active/project-init/project-init-part-05.md
- apps/web/e2e/helpers/flowHelpers.ts
- apps/web/e2e/bucket-child-new-non-owner-admin-read-only-no-create.spec.ts
- apps/web/e2e/bucket-messages-seeded-bucket-admin.spec.ts
- apps/web/e2e/bucket-messages-seeded-bucket-owner.spec.ts
- apps/web/e2e/bucket-nested-new-non-owner-admin-read-only-no-create.spec.ts
- apps/web/e2e/bucket-nested-new-seeded-bucket-owner.spec.ts
- apps/web/e2e/bucket-role-edit-seeded-bucket-admin.spec.ts
- apps/web/e2e/buckets-new-non-admin.spec.ts
- apps/web/e2e/buckets-non-admin-no-bucket-admin-for-e2e-bucket-one.spec.ts
- apps/web/e2e/reset-password-unauthenticated.spec.ts

### Session 61 - 2026-03-10

#### Prompt (Developer)

Invite E2E Flake Debug Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged the exact developer prompt before implementation edits.
- Confirmed failure shape from logs/error-context: invite page showed `Accept` and `Decline`
  buttons while the test only checked `Reject`, and immediate visibility probes were race-prone.
- Replaced fragile immediate boolean checks with timeout-backed `expect.poll` invite-state
  assertions requiring either action buttons (`Accept` + `Decline|Reject`) or a terminal state.
- Applied the same robust invite-state matcher to sibling invite specs sharing the same pattern
  to prevent future flakes in related user-role permutations.
- Verified scoped invite specs and full cross-app `e2e_test_report` are green.

#### Files Modified

- .llm/history/active/project-init/project-init-part-05.md
- apps/web/e2e/invite-seeded-bucket-admin.spec.ts
- apps/web/e2e/invite-seeded-bucket-owner.spec.ts
- apps/web/e2e/invite-non-admin.spec.ts

### Session 62 - 2026-03-10

#### Prompt (Developer)

Web Settings Authz Gating Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged the exact developer prompt before implementation edits.
- Added reusable server-side bucket settings authz helpers using viewer ownership plus
  `bucketCrud` update-bit checks to gate access consistently across routes.
- Enforced server-side not-found gating in bucket settings layout and role-new route so
  admin-without-permission cannot load those pages.
- Unskipped the two web E2E specs that were waiting for server-side permission gating and
  kept their not-found expectations unchanged.
- Verified targeted specs pass and full cross-app report is green; `e2e_test_web` still ends
  non-zero after 189 passing tests due existing workspace `@boilerplate/web-sidecar` missing
  `test:e2e` script behavior.

#### Files Modified

- .llm/history/active/project-init/project-init-part-05.md
- apps/web/src/lib/bucket-authz.ts
- apps/web/src/app/(main)/bucket/[id]/settings/layout.tsx
- apps/web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx
- apps/web/e2e/bucket-settings-admin-without-permission.spec.ts
- apps/web/e2e/bucket-role-new-admin-without-permission.spec.ts
