# Feature: project-init (Part 6)

> Continuation of `project-init-part-05.md`.

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

Stabilize API integration reliability and E2E API-gate behavior by enforcing linear API test execution.

## Sessions

### Session 68 - 2026-03-10

#### Prompt (Developer)

Enforce Linear API Test Execution

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged the exact developer prompt before implementation edits.
- Enforced linear API integration execution in both API apps by disabling file parallelism
  and forcing a single Vitest worker (`fileParallelism: false`, `minWorkers: 1`,
  `maxWorkers: 1`).
- Verified reliability with two consecutive root `npm run test` runs and one full
  `make e2e_test_report` run; API gate and both web/management-web E2E suites passed.

#### Files Modified

- .llm/history/active/project-init/project-init-part-06.md
- apps/api/vitest.config.ts
- apps/management-api/vitest.config.ts

### Session 69 - 2026-03-11

#### Prompt (Developer)

Refresh `e2e-suite-title-normalization` Plan Set

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Refreshed plan baseline counts to current repository state (`195` total specs; `179`
  remaining verbose top-level suite titles; `16` already concise in web).
- Tightened sweep phases to explicitly handle both quote styles in top-level `describe`
  strings and preserve strict no-touch boundaries for nested/test/step text and logic.
- Updated validation phase to align with repository policy: static checks only in-agent, with
  explicit user-run `make` verification command handoff instead of executing tests.
- Removed stale execution-order wording and aligned copy-pasta instructions with the same
  non-execution verification policy.
- Performed final consistency pass across all active plan-set files and checked diagnostics.

#### Files Modified

- .llm/history/active/project-init/project-init-part-06.md
- .llm/plans/active/e2e-suite-title-normalization/00-EXECUTION-ORDER.md
- .llm/plans/active/e2e-suite-title-normalization/00-SUMMARY.md
- .llm/plans/active/e2e-suite-title-normalization/02-web-suite-title-sweep.md
- .llm/plans/active/e2e-suite-title-normalization/03-management-web-suite-title-sweep.md
- .llm/plans/active/e2e-suite-title-normalization/04-validation-and-report-smoke.md
- .llm/plans/active/e2e-suite-title-normalization/COPY-PASTA.md

### Session 70 - 2026-03-15

#### Prompt (Developer)

Fix lint errors from terminal logs

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Fixed TableWithSort non-null assertions by adding explicit guards (`sortPrefsCookieName !== undefined && sortPrefsListKey !== undefined`) so TypeScript narrows without `!`.
- Removed all unused imports and variables from 45 management-web E2E spec files per avoid-unused-props-vars (no `_` prefix; remove unused symbols).
- Removed unused const `E2E_VALID_PASSWORD` / `E2E_PASSWORD` where applicable; removed unused `expect` from Playwright import where not used.
- Verified with `./scripts/nix/with-env npm run lint:fix` (exit 0).

#### Files Modified

- packages/ui/src/components/table/TableWithSort/TableWithSort.tsx
- apps/management-web/e2e/admin-detail-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-detail-limited-admin-admins-read.spec.ts
- apps/management-web/e2e/admin-detail-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admin-detail-unauthenticated.spec.ts
- apps/management-web/e2e/admin-edit-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admin-edit-unauthenticated.spec.ts
- apps/management-web/e2e/admin-role-new-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admin-role-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admin-role-new-unauthenticated.spec.ts
- apps/management-web/e2e/admins-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admins-new-admin-with-buckets-read-no-admins-crud.spec.ts
- apps/management-web/e2e/admins-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admins-new-unauthenticated.spec.ts
- apps/management-web/e2e/admins-super-admin-full-crud.spec.ts
- apps/management-web/e2e/admins-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-child-new-admin-with-buckets-read-no-create.spec.ts
- apps/management-web/e2e/bucket-child-new-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-child-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-child-new-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-detail-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-detail-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-detail-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-edit-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-edit-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-message-edit-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-message-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-message-edit-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-messages-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-messages-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-messages-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-role-edit-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-role-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-role-edit-unauthenticated.spec.ts
- apps/management-web/e2e/bucket-role-new-limited-admin-no-buckets-read.spec.ts
- apps/management-web/e2e/bucket-role-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/bucket-role-new-unauthenticated.spec.ts
- apps/management-web/e2e/login-unauthenticated.spec.ts
- apps/management-web/e2e/user-detail-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/user-detail-limited-admin-users-read.spec.ts
- apps/management-web/e2e/user-detail-unauthenticated.spec.ts
- apps/management-web/e2e/user-edit-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/user-edit-super-admin-full-crud.spec.ts
- apps/management-web/e2e/user-edit-unauthenticated.spec.ts
- apps/management-web/e2e/users-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/users-new-admin-with-buckets-read-no-users-crud.spec.ts
- apps/management-web/e2e/users-new-super-admin-full-crud.spec.ts
- apps/management-web/e2e/users-new-unauthenticated.spec.ts
- apps/management-web/e2e/users-super-admin-full-crud.spec.ts
- apps/management-web/e2e/users-unauthenticated.spec.ts
- .llm/history/active/project-init/project-init-part-06.md
