# Feature: project-init (Part 2)

> **Note**: This LLM history file is optional. If you're not using LLM assistance for development, you can delete this file and the containing directory. The history tracking system helps document LLM-assisted decisions but is not required for contributing.
>
> **10-Session Limit**: Each part file is limited to 10 sessions. When adding Session 21, create `project-init-part-03.md`.

## Metadata
- Started: 2026-03-03
- Completed: In Progress
- Author: Mitch Downey
- LLM(s): Cursor, Claude, etc.
- GitHub Issues: https://github.com/podverse/boilerplate/issues/20
- Branch: feature/project-init
- Origin: https://github.com/podverse/boilerplate.git
- Is Fork: no

## Context

[What problem does this solve? What's the goal?]

## Sessions

### Session 11 - 2026-03-07

#### Prompt (Developer)
Final E2E Gap Pass

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- Treat the current `web-*.md` and `mgmt-*.md` files as the canonical detailed
  E2E plans and update shared docs to describe refinement-in-place rather than a
  second detail-file layer.
- Replace vague route outcomes with exact redirect destinations or protected
  branches where behavior is known, especially for redirect-only message/profile
  routes and management no-permission flows.
- Centralize real fixture, token, report-mode, and mutation-isolation guidance
  around the actual E2E seed scripts so page plans stop assuming child buckets,
  scoped admins, or one-time tokens already exist in seed data.

#### Files Changed
- .llm/history/active/project-init/project-init-part-02.md
- .llm/plans/active/e2e-page-tests/00-SUMMARY.md
- .llm/plans/active/e2e-page-tests/00-EXECUTION-ORDER.md
- .llm/plans/active/e2e-page-tests/01-foundation.md
- .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md
- .llm/plans/active/e2e-page-tests/COPY-PASTA.md
- .llm/plans/active/e2e-page-tests/web-06-bucket-detail.md
- .llm/plans/active/e2e-page-tests/web-07-bucket-settings.md
- .llm/plans/active/e2e-page-tests/web-09-bucket-messages.md
- .llm/plans/active/e2e-page-tests/web-13-bucket-role-new.md
- .llm/plans/active/e2e-page-tests/web-14-bucket-role-edit.md
- .llm/plans/active/e2e-page-tests/web-15-short-bucket.md
- .llm/plans/active/e2e-page-tests/web-19-invite.md
- .llm/plans/active/e2e-page-tests/web-23-signup.md
- .llm/plans/active/e2e-page-tests/web-25-reset-password.md
- .llm/plans/active/e2e-page-tests/mgmt-04-buckets-list.md
- .llm/plans/active/e2e-page-tests/mgmt-05-buckets-new.md
- .llm/plans/active/e2e-page-tests/mgmt-06-bucket-detail.md
- .llm/plans/active/e2e-page-tests/mgmt-08-bucket-settings.md
- .llm/plans/active/e2e-page-tests/mgmt-09-bucket-admin-edit.md
- .llm/plans/active/e2e-page-tests/mgmt-10-bucket-messages.md
- .llm/plans/active/e2e-page-tests/mgmt-12-bucket-child-new.md
- .llm/plans/active/e2e-page-tests/mgmt-13-bucket-role-new.md
- .llm/plans/active/e2e-page-tests/mgmt-14-bucket-role-edit.md
- .llm/plans/active/e2e-page-tests/mgmt-15-users-list.md
- .llm/plans/active/e2e-page-tests/mgmt-16-users-new.md
- .llm/plans/active/e2e-page-tests/mgmt-17-user-detail.md
- .llm/plans/active/e2e-page-tests/mgmt-18-user-edit.md
- .llm/plans/active/e2e-page-tests/mgmt-19-admins-list.md
- .llm/plans/active/e2e-page-tests/mgmt-20-admins-new.md
- .llm/plans/active/e2e-page-tests/mgmt-21-admin-detail.md
- .llm/plans/active/e2e-page-tests/mgmt-22-admin-edit.md
- .llm/plans/active/e2e-page-tests/mgmt-23-events.md
- .llm/plans/active/e2e-page-tests/mgmt-24-profile.md
- .llm/plans/active/e2e-page-tests/mgmt-27-admin-role-new.md
- docs/testing/E2E-PAGE-TESTING.md
# Feature: project-init (Part 2)

> Continuation of `project-init-part-01.md` after reaching the 10-session limit.

## Metadata
- Started: 2026-03-03
- Completed: In Progress
- Author: Mitch Downey
- LLM(s): Cursor, Claude, etc.
- GitHub Issues: https://github.com/podverse/boilerplate/issues/20
- Branch: feature/project-init
- Origin: https://github.com/podverse/boilerplate.git
- Is Fork: no

## Context

[What problem does this solve? What's the goal?]

## Sessions

### Session 11 - 2026-03-07

#### Prompt (Developer)
update any skills as needed to reflect our current e2e processes. also, note that the file names of screenshots should be detailed so that they summarize the tests in a way so a qa can read just the file name and have a good enough understanding of what is supposed to be displayed in that test. very long file names that are clear are better than succinct but unclear ones

#### Key Decisions

- Update the E2E skill docs to match the current production-like Playwright startup flow and report-mode screenshot process.
- Change step screenshot naming to include both test context and explicit step intent so filenames are QA-readable without opening the report.
- Keep report-mode gating and attachment behavior unchanged while improving filename clarity.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- .cursor/skills/e2e-page-tests/SKILL.md
- apps/web/e2e/helpers/stepScreenshots.ts
- apps/management-web/e2e/helpers/stepScreenshots.ts
- apps/web/e2e/home.spec.ts
- apps/web/e2e/dashboard.spec.ts
- apps/management-web/e2e/home.spec.ts
- apps/management-web/e2e/dashboard.spec.ts

---

### Session 12 - 2026-03-07

#### Prompt (Developer)
Remove Vestigial E2E Test-Results Files

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Limit cleanup strictly to generated Playwright `test-results` artifacts outside `.artifacts`, per confirmed scope.
- Remove both app-level `test-results` directories and verify no screenshot artifact files remain outside `.artifacts/e2e-reports`.
- Leave all existing source, docs, plan, and prior in-progress repo changes untouched.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/web/test-results/ (removed)
- apps/management-web/test-results/ (removed)

---

## Related Resources

- [Link to PR]
- [Link to related issues]

---

### Session 13 - 2026-03-08

#### Prompt (Developer)
Fix E2E Auth/Public Test Failures

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Keep fixes test-only by changing Playwright startup environment wiring and E2E assertions, with no app runtime logic changes.
- Make web and management E2E servers deterministic by explicitly setting test DB/Valkey env vars and `NEXT_PUBLIC_*` API env vars in Playwright `webServer` commands.
- Run APIs under `NODE_ENV=test` for E2E startup to avoid strict auth rate-limit lockouts during full suites.
- Remove brittle `.or(...)` locators that trigger Playwright strict-mode when multiple valid elements are visible, replacing them with specific/assertive selectors that reflect current UI labels and messages.
- Verify incrementally (focused specs first, then full report target) and continue adjusting only failing tests until `make e2e_test_report` passes.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/web/playwright.config.ts
- apps/management-web/playwright.config.ts
- apps/web/e2e/login.spec.ts
- apps/management-web/e2e/login.spec.ts
- apps/web/e2e/send-message.spec.ts
- apps/web/e2e/short-bucket.spec.ts
- apps/web/e2e/bucket-detail.spec.ts
- apps/web/e2e/bucket-settings.spec.ts
- apps/web/e2e/bucket-messages.spec.ts
- apps/web/e2e/forgot-password.spec.ts
- apps/web/e2e/buckets-new.spec.ts
- apps/web/e2e/buckets.spec.ts
- apps/web/e2e/profile.spec.ts
- apps/web/e2e/signup.spec.ts
- apps/management-web/e2e/admins.spec.ts
- apps/management-web/e2e/users.spec.ts
- apps/management-web/e2e/buckets.spec.ts
- apps/management-web/e2e/events.spec.ts
- apps/management-web/e2e/settings.spec.ts
- apps/management-web/e2e/profile.spec.ts
- apps/management-web/e2e/bucket-detail.spec.ts

---

### Session 14 - 2026-03-08

#### Prompt (Developer)
Continue E2E Plan Execution

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Implemented all missing route specs listed in the continuation plan: 7 web and 16 management-web files.
- Kept selectors strict-mode safe by replacing ambiguous broad locators with specific, single-target assertions.
- Switched invalid-ID fixtures on management routes from non-UUID strings to valid-but-missing UUIDs to avoid crashing management-api during E2E.
- Expanded partially covered high-risk routes (create/settings/list CTA navigation and validation branches) in existing web and management specs.
- Added reusable advanced E2E fixture helpers for child buckets, roles, and invitation token flows to support future deeper CRUD/permission tests.
- Fixed unrelated pre-E2E gate failure in auth rate-limit tests by increasing timeout for the strict-login rate-limit case and removing unnecessary type assertions.
- Verified end-to-end with full report pipeline: `make e2e_test_report` passes for API tests, management-api tests, web E2E, and management-web E2E.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/web/e2e/bucket-admin-edit.spec.ts
- apps/web/e2e/bucket-message-edit.spec.ts
- apps/web/e2e/bucket-child-new.spec.ts
- apps/web/e2e/bucket-nested-new.spec.ts
- apps/web/e2e/bucket-role-new.spec.ts
- apps/web/e2e/bucket-role-edit.spec.ts
- apps/web/e2e/invite.spec.ts
- apps/web/e2e/buckets-new.spec.ts
- apps/web/e2e/bucket-settings.spec.ts
- apps/web/e2e/bucket-detail.spec.ts
- apps/web/e2e/helpers/advancedFixtures.ts
- apps/management-web/e2e/buckets-new.spec.ts
- apps/management-web/e2e/bucket-edit.spec.ts
- apps/management-web/e2e/bucket-settings.spec.ts
- apps/management-web/e2e/bucket-admin-edit.spec.ts
- apps/management-web/e2e/bucket-messages.spec.ts
- apps/management-web/e2e/bucket-message-edit.spec.ts
- apps/management-web/e2e/bucket-child-new.spec.ts
- apps/management-web/e2e/bucket-role-new.spec.ts
- apps/management-web/e2e/bucket-role-edit.spec.ts
- apps/management-web/e2e/users-new.spec.ts
- apps/management-web/e2e/user-detail.spec.ts
- apps/management-web/e2e/user-edit.spec.ts
- apps/management-web/e2e/admins-new.spec.ts
- apps/management-web/e2e/admin-detail.spec.ts
- apps/management-web/e2e/admin-edit.spec.ts
- apps/management-web/e2e/admin-role-new.spec.ts
- apps/management-web/e2e/buckets.spec.ts
- apps/management-web/e2e/users.spec.ts
- apps/management-web/e2e/admins.spec.ts
- apps/management-web/e2e/helpers/advancedFixtures.ts
- apps/api/src/test/auth-rate-limit.test.ts

---

### Session 15 - 2026-03-08

#### Prompt (Developer)
if any e2e plans are completed, then move them to completed

#### Key Decisions

- Moved only plan files with clearly implemented route specs (the 23 phase-one previously-not-started route plans) from active to completed.
- Left meta/foundation docs and remaining partially covered route plans in active for continued execution.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- .llm/plans/completed/e2e-page-tests/web-08-bucket-admin-edit.md
- .llm/plans/completed/e2e-page-tests/web-10-bucket-message-edit.md
- .llm/plans/completed/e2e-page-tests/web-11-bucket-child-new.md
- .llm/plans/completed/e2e-page-tests/web-12-bucket-nested-new.md
- .llm/plans/completed/e2e-page-tests/web-13-bucket-role-new.md
- .llm/plans/completed/e2e-page-tests/web-14-bucket-role-edit.md
- .llm/plans/completed/e2e-page-tests/web-19-invite.md
- .llm/plans/completed/e2e-page-tests/mgmt-05-buckets-new.md
- .llm/plans/completed/e2e-page-tests/mgmt-07-bucket-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-08-bucket-settings.md
- .llm/plans/completed/e2e-page-tests/mgmt-09-bucket-admin-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-10-bucket-messages.md
- .llm/plans/completed/e2e-page-tests/mgmt-11-bucket-message-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-12-bucket-child-new.md
- .llm/plans/completed/e2e-page-tests/mgmt-13-bucket-role-new.md
- .llm/plans/completed/e2e-page-tests/mgmt-14-bucket-role-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-16-users-new.md
- .llm/plans/completed/e2e-page-tests/mgmt-17-user-detail.md
- .llm/plans/completed/e2e-page-tests/mgmt-18-user-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-20-admins-new.md
- .llm/plans/completed/e2e-page-tests/mgmt-21-admin-detail.md
- .llm/plans/completed/e2e-page-tests/mgmt-22-admin-edit.md
- .llm/plans/completed/e2e-page-tests/mgmt-27-admin-role-new.md

---

### Session 16 - 2026-03-08

#### Prompt (Developer)
continue working on e2e plans

#### Key Decisions

- Expanded active route coverage for public short-bucket/send-message and management profile/settings/events plans with additional deterministic assertions and URL/tab/query behavior checks.
- Removed remaining strict-mode-prone `.or(...)` assertions in updated specs by switching to single explicit locators.
- Updated public send-message validation branch to assert disabled-submit behavior before required fields are filled (matching current UI behavior).
- Verified updated specs with focused Playwright runs in both web and management-web apps.
- Moved newly completed plan files (`web-15`, `web-16`, `mgmt-23`, `mgmt-24`, `mgmt-25`) from active to completed.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/web/e2e/short-bucket.spec.ts
- apps/web/e2e/send-message.spec.ts
- apps/management-web/e2e/events.spec.ts
- apps/management-web/e2e/profile.spec.ts
- apps/management-web/e2e/settings.spec.ts
- .llm/plans/completed/e2e-page-tests/web-15-short-bucket.md
- .llm/plans/completed/e2e-page-tests/web-16-short-send-message.md
- .llm/plans/completed/e2e-page-tests/mgmt-23-events.md
- .llm/plans/completed/e2e-page-tests/mgmt-24-profile.md
- .llm/plans/completed/e2e-page-tests/mgmt-25-settings.md

---

### Session 17 - 2026-03-08

#### Prompt (Developer)
revise plans and implement

#### Key Decisions

- Keep events page URL behavior consistent with other table pages and treat the failure as a brittle E2E assertion mismatch.
- Update the events E2E test to assert URL semantics that remain valid across canonicalization variants (`sort`-only and `sortBy/sortOrder`-augmented forms).
- Fix a real app bug in management bucket child creation form by switching translation lookups from missing `buckets.*` keys to existing `common.bucketForm.*` and `common.bucketDetail.*` keys.
- Verify with focused management-web specs and then full management-web E2E suite.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/management-web/e2e/events.spec.ts
- apps/management-web/src/app/(main)/bucket/[id]/new/NewChildBucketFormClient.tsx

---

### Session 18 - 2026-03-08

#### Prompt (Developer)
Assess `terminals/20.txt` Errors and Fix Strategy

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Classified the `terminals/20.txt` failure as test instability risk, not a clear app-route regression, because `/auth/login` passed in focused and full reruns while failing previously in a single cookie-auth test step.
- Hardened the cookie-auth test by removing `request.agent` state reliance and using explicit `set-cookie` extraction plus `Cookie` header for `/auth/me`.
- Added high-signal diagnostics around the login prerequisite in that test to include status and response body when it fails.
- Kept app runtime/auth route logic unchanged.
- Verified stability with focused auth tests, full API test suite, and `make e2e_test_api`.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/api/src/test/auth.test.ts

---

### Session 19 - 2026-03-08

#### Prompt (Developer)
Fix API Rate-Limit Test Timeout

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Fixed only test timing behavior by adding a per-test timeout to the non-rate-limited logout loop test in `auth-rate-limit.test.ts`.
- Kept API app logic unchanged per scope.
- Verified with focused `auth-rate-limit` run and full `apps/api` suite.
- First `make e2e_test_api` rerun surfaced a transient `socket hang up` in a different rate-limit test; immediate rerun passed fully, confirming no persistent regression from the timeout change.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- apps/api/src/test/auth-rate-limit.test.ts

---

### Session 20 - 2026-03-08

#### Prompt (Developer)
sweep through the e2e plans, determine which are completed and move to completed

#### Key Decisions

- Classified all remaining route-level `web-*.md` and `mgmt-*.md` files in active as completed based on matching implemented Playwright specs under `apps/web/e2e` and `apps/management-web/e2e`.
- Kept framework/meta plan docs (`00-*`, `01-foundation`, `02-detailed-plan-generation`, `03-route-to-plan-map`, `COPY-PASTA`) in active.
- Moved all completed route-level plans from active to completed.

#### Files Changed

- .llm/history/active/project-init/project-init-part-02.md
- .llm/plans/active/e2e-page-tests/mgmt-*.md (moved completed route plans out)
- .llm/plans/active/e2e-page-tests/web-*.md (moved completed route plans out)
- .llm/plans/completed/e2e-page-tests/mgmt-*.md (received moved route plans)
- .llm/plans/completed/e2e-page-tests/web-*.md (received moved route plans)
