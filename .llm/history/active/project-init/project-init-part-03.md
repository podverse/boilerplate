# Feature: project-init (Part 3)

> Continuation of `project-init-part-02.md` after reaching the 10-session limit.

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

### Session 21 - 2026-03-08

#### Prompt (Developer)
review the active plan e2e files and if work is remaining that is still relevant and needed, do it

#### Key Decisions

- Treated active E2E plan docs as maintenance metadata only, since all route-level
  `web-*.md`/`mgmt-*.md` plans were already moved to completed.
- Updated active plan docs to reference completed route-plan files explicitly and
  removed stale wording that implied route plans were still active.
- Kept route-to-plan mapping in active for discoverability, but pointed every
  mapped route to its completed detailed plan path.

#### Files Changed

- .llm/history/active/project-init/project-init-part-03.md
- .llm/plans/active/e2e-page-tests/00-SUMMARY.md
- .llm/plans/active/e2e-page-tests/00-EXECUTION-ORDER.md
- .llm/plans/active/e2e-page-tests/01-foundation.md
- .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md
- .llm/plans/active/e2e-page-tests/03-route-to-plan-map.md
- .llm/plans/active/e2e-page-tests/COPY-PASTA.md

### Session 22 - 2026-03-08

#### Prompt (Developer)
if all the e2e page tests plas are finished then move to completed

#### Key Decisions

- Confirmed all route-level E2E page-test plan files were already completed.
- Treated the remaining six active files as completed meta/foundation plan docs
  and moved them to `.llm/plans/completed/e2e-page-tests`.
- Left `.llm/plans/active/e2e-page-tests` empty.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- .llm/plans/active/e2e-page-tests/00-SUMMARY.md (moved)
- .llm/plans/active/e2e-page-tests/00-EXECUTION-ORDER.md (moved)
- .llm/plans/active/e2e-page-tests/01-foundation.md (moved)
- .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md (moved)
- .llm/plans/active/e2e-page-tests/03-route-to-plan-map.md (moved)
- .llm/plans/active/e2e-page-tests/COPY-PASTA.md (moved)
- .llm/plans/completed/e2e-page-tests/00-SUMMARY.md
- .llm/plans/completed/e2e-page-tests/00-EXECUTION-ORDER.md
- .llm/plans/completed/e2e-page-tests/01-foundation.md
- .llm/plans/completed/e2e-page-tests/02-detailed-plan-generation.md
- .llm/plans/completed/e2e-page-tests/03-route-to-plan-map.md
- .llm/plans/completed/e2e-page-tests/COPY-PASTA.md

### Session 23 - 2026-03-08

#### Prompt (Developer)
if you think your new plan files are worthwhile, then go ahead and implement them

#### Key Decisions

- Implemented high-impact E2E depth improvements in both `apps/web` and
  `apps/management-web`, prioritizing CRUD and UI state behavior
  (show/hide/enable/disable/cancel/validation).
- Kept changes test-only; no app logic changes.
- Adjusted management list URL assertions to allow canonical query params
  (e.g. `sortBy`/`sortOrder`) instead of requiring bare list paths.
- Added robust success-state branching for management user creation to support
  both outcomes: redirect to users list or in-page set-password link UI.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- apps/web/e2e/buckets-new.spec.ts
- apps/web/e2e/bucket-settings.spec.ts
- apps/web/e2e/send-message.spec.ts
- apps/management-web/e2e/users-new.spec.ts
- apps/management-web/e2e/buckets-new.spec.ts

### Session 24 - 2026-03-08

#### Prompt (Developer)
implement the plans you created if you think they are worth implementing

#### Key Decisions

- Implemented the next worthwhile plan slice by deepening role CRUD/state E2E
  coverage in both `apps/web` and `apps/management-web`.
- Added robust create/edit happy-path tests for custom bucket roles using UI
  creation and edit flows rather than brittle direct fixture endpoints.
- Standardized required-field coverage for role creation by asserting required
  behavior and empty-submit non-navigation, since submit buttons remain enabled.
- Kept all changes test-only and validated via targeted Playwright runs.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- apps/web/e2e/bucket-role-new.spec.ts
- apps/web/e2e/bucket-role-edit.spec.ts
- apps/management-web/e2e/bucket-role-new.spec.ts
- apps/management-web/e2e/bucket-role-edit.spec.ts

### Session 25 - 2026-03-08

#### Prompt (Developer)
Web E2E Gap Hardening (Round 2)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Implemented all four Round 2 plan workstreams in `apps/web/e2e` without modifying
  the attached plan file.
- Expanded role/admin, message edit, child/nested topic, settings, invite, auth edge,
  and explicit state-branch assertions while tuning tests to match real UI behavior.
- Preserved deterministic and resilient assertions where runtime behavior differed
  (e.g., disabled submit, optional invite decision states, canonical URL handling).
- Verified changes with both targeted modified-suite runs and a full web E2E run.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- apps/web/e2e/bucket-settings.spec.ts
- apps/web/e2e/bucket-message-edit.spec.ts
- apps/web/e2e/bucket-child-new.spec.ts
- apps/web/e2e/bucket-nested-new.spec.ts
- apps/web/e2e/settings.spec.ts
- apps/web/e2e/invite.spec.ts
- apps/web/e2e/login.spec.ts
- apps/web/e2e/signup.spec.ts
- apps/web/e2e/forgot-password.spec.ts
- apps/web/e2e/buckets.spec.ts
- apps/web/e2e/bucket-detail.spec.ts

### Session 26 - 2026-03-08

#### Prompt (Developer)
E2E Bulletproof Matrices Program

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Created strict, explicit web and management-web CRUD/state/auth matrices as
  the single source of truth under `docs/testing/` (E2E-CRUD-STATE-AUTH-MATRICES.md, E2E-CRUD-STATE-AUTH-MATRIX-WEB.md, E2E-CRUD-STATE-AUTH-MATRIX-MANAGEMENT-WEB.md).
- Implemented high-risk web gaps for delete lifecycle, permission/state contracts,
  and URL-state assertions in focused existing specs.
- Implemented high-risk management-web gaps for delete lifecycle, authZ row-action
  behavior, update persistence, and URL-state contracts.
- Added three reusable matrix-oriented skills to enforce CRUD/state/authZ and
  URL-state coverage patterns in future E2E work.
- Verified with targeted suites plus full web and full management-web Playwright
  suites; both full suites passed.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-WEB.md
- docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-MANAGEMENT-WEB.md
- .cursor/skills/e2e-crud-state-matrix/SKILL.md
- .cursor/skills/e2e-authz-matrix/SKILL.md
- .cursor/skills/e2e-url-state-contracts/SKILL.md
- apps/web/e2e/bucket-role-new.spec.ts
- apps/web/e2e/bucket-role-edit.spec.ts
- apps/web/e2e/bucket-settings.spec.ts
- apps/web/e2e/buckets.spec.ts
- apps/management-web/e2e/users.spec.ts
- apps/management-web/e2e/admins.spec.ts
- apps/management-web/e2e/buckets.spec.ts
- apps/management-web/e2e/user-edit.spec.ts
- apps/management-web/e2e/admin-edit.spec.ts

### Session 27 - 2026-03-08

#### Prompt (Developer)

Targeted Make Verification Rule + Skill

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added three scoped report-mode Make targets with variable inputs:
  `e2e_test_web_report_spec`, `e2e_test_management_web_report_spec`,
  and `e2e_test_report_scoped`.
- Kept scoped targets aligned with existing report conventions: step screenshots,
  timestamped `.artifacts/e2e-reports/<datetime>/...` output, `latest` symlink,
  and 10-run rotation.
- Added a dedicated Cursor skill and an always-applied Cursor rule so future
  implementation responses end with targeted `make` verification commands.
- Updated E2E docs to make feature-scoped report mode the default guidance and
  reserve full-suite report runs for broad/cross-cutting changes.
- Lint diagnostics were clean; local `make -n` parse checks were blocked by an
  environment prerequisite (Xcode license not yet accepted on this machine).

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md
- .cursor/skills/response-ending-make-verify/SKILL.md
- .cursor/rules/end-with-targeted-make-report-verify.mdc

### Session 28 - 2026-03-08

#### Prompt (Developer)
@boilerplate/infra/database/migrations/0004_drop_profile_visibility.sql:1-4 I don't think that this file is needed  because we should assume that the mic migrations are used in a greenfield environment, so any changes should be reflected in the create table. rather than adding an alter table later

#### Key Decisions

- Removed the redundant `0004_drop_profile_visibility.sql` migration because
  `profile_visibility` is already absent from the baseline `0001_user_schema.sql`.
- Kept greenfield schema initialization clean by removing the same drop-column
  block from `infra/database/combined/init_database.sql`.
- Left migration numbering with `0000`-`0003` only; no replacement migration was
  added since there is no schema change needed.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- infra/database/combined/init_database.sql
- infra/database/migrations/0004_drop_profile_visibility.sql (deleted)

### Session 29 - 2026-03-08

#### Prompt (Developer)
@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/20.txt:800-802 when a spec environment variable is passed in like this, the report Page titles should look like this

E2E Web Report - e2e/home.spec.ts

 It should be clear that this is not a comprehensive web report, but rather a report for a specific spec.

#### Key Decisions

- Added an explicit scoped-report context env var (`E2E_REPORT_SPEC`) in all
  spec-targeted report-mode Make targets so the reporter can distinguish
  focused runs from comprehensive suite runs.
- Updated the custom Playwright HTML steps reporter to append the spec path to
  web/management-web titles when `E2E_REPORT_SPEC` is present, producing titles
  like `E2E Web Report - e2e/home.spec.ts`.
- Kept default full-suite report titles unchanged when no scoped spec env var is
  provided.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
- makefiles/local/Makefile.local.e2e.mk
- scripts/e2e-html-steps-reporter.ts

### Session 30 - 2026-03-08

#### Prompt (Developer)

Spec DRY Helper Audit Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Logged prompt before modifying files, then implemented plan waves in order.

#### Files Modified

- .llm/history/active/project-init/project-init-part-03.md
