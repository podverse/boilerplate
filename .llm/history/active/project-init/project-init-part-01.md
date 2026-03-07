# Feature: project-init (Part 1)

> **Note**: This LLM history file is optional. If you're not using LLM assistance for development, you can delete this file and the containing directory. The history tracking system helps document LLM-assisted decisions but is not required for contributing.
> 
> **10-Session Limit**: Each part file is limited to 10 sessions. When adding Session 11, create `project-init-part-02.md`.

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

### Session 1 - 2026-03-03

#### Prompt (Developer)
[First prompt will go here]

#### Key Decisions
- [Decision and rationale]

#### Files Changed
- [List of files]

---

### Session 2 - 2026-03-06

#### Prompt (Developer)
the e2e-page-test plans need to be updated to account for the fact the web and
management-web apps may have significant changes and new or removed pages since
the time they were generated. Revise the plans and create new ones where needed.
The files for individual page plans don't need to go into great detail now But
it will be part of the plans to generate more detailed plans when it is time to
work on those plans. Ultimately, in the end, we will want extremely detailed and
thorough automated UI end to end tests that will validate things like layout,
values, functionality, and in meticulous detail. And Verify the various crud
behaviors we expect on each page will work Also, if there is a good open source
option for us to view the results of these tests. I would like it to take
screenshots so we can review each individual visual test that happens to confirm
manually that. The pages look the way our QA testers expect. Simply opening the
files for images of screenshots may not be as good as we can do it. If there is
an app or third-party development tool we can use for this purpose, please
recommend it. I don't know if you're not just saying that. I imagine this tool
could show us a screenshot and also provide context of what test it represents.
in human readable language and also the result of the text as a success or
failure.

#### Prompt (Developer)
Refresh E2E Page-Test Plans

Implement the plan as specified, it is attached for your reference. Do NOT edit
the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark
them as in_progress as you work, starting with the first one. Don't stop until
you have completed all the to-dos.

#### Key Decisions
- Rebaseline active E2E page-test plans against current App Router page files for
  both web and management-web.
- Keep per-page plans lightweight now and add a dedicated stage to generate
  implementation-grade detailed plans later.
- Use Playwright HTML report + traces + screenshot/video retention as the primary
  open-source review workflow.

#### Files Changed
- .llm/history/active/project-init/project-init-part-01.md
- .llm/plans/active/e2e-page-tests/00-SUMMARY.md
- .llm/plans/active/e2e-page-tests/00-EXECUTION-ORDER.md
- .llm/plans/active/e2e-page-tests/01-foundation.md
- .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md
- .llm/plans/active/e2e-page-tests/03-route-to-plan-map.md
- .llm/plans/active/e2e-page-tests/COPY-PASTA.md
- .llm/plans/active/e2e-page-tests/web-11-bucket-child-new.md
- .llm/plans/active/e2e-page-tests/web-12-bucket-nested-new.md
- .llm/plans/active/e2e-page-tests/web-13-bucket-role-new.md
- .llm/plans/active/e2e-page-tests/web-14-bucket-role-edit.md
- .llm/plans/active/e2e-page-tests/web-11-topic-new.md
- .llm/plans/active/e2e-page-tests/web-12-topic-detail.md
- .llm/plans/active/e2e-page-tests/web-13-topic-messages.md
- .llm/plans/active/e2e-page-tests/web-14-topic-message-edit.md
- .llm/plans/active/e2e-page-tests/web-17-short-topic.md
- .llm/plans/active/e2e-page-tests/web-18-short-topic-send.md
- .llm/plans/active/e2e-page-tests/mgmt-12-bucket-child-new.md
- .llm/plans/active/e2e-page-tests/mgmt-13-bucket-role-new.md
- .llm/plans/active/e2e-page-tests/mgmt-14-bucket-role-edit.md
- .llm/plans/active/e2e-page-tests/mgmt-27-admin-role-new.md
- .llm/plans/active/e2e-page-tests/mgmt-12-topic-detail.md
- .llm/plans/active/e2e-page-tests/mgmt-13-topic-messages.md
- .llm/plans/active/e2e-page-tests/mgmt-14-topic-message-edit.md
- docs/testing/E2E-PAGE-TESTING.md

---

### Session 3 - 2026-03-06

#### Prompt (Developer)
if there are deprecated placeholder plans that are no longer relevant, go ahead
and remove them

#### Key Decisions

- Remove deprecated topic-era placeholder plan files from the active plan set.
- Update summary and route-map docs so they no longer reference deleted files.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- apps/web/e2e/home.spec.ts
- apps/management-web/e2e/home.spec.ts
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md
- .llm/plans/active/e2e-page-tests/00-SUMMARY.md
- .llm/plans/active/e2e-page-tests/03-route-to-plan-map.md
- .llm/plans/active/e2e-page-tests/web-11-topic-new.md (deleted)
- .llm/plans/active/e2e-page-tests/web-12-topic-detail.md (deleted)
- .llm/plans/active/e2e-page-tests/web-13-topic-messages.md (deleted)
- .llm/plans/active/e2e-page-tests/web-14-topic-message-edit.md (deleted)
- .llm/plans/active/e2e-page-tests/web-17-short-topic.md (deleted)
- .llm/plans/active/e2e-page-tests/web-18-short-topic-send.md (deleted)
- .llm/plans/active/e2e-page-tests/mgmt-12-topic-detail.md (deleted)
- .llm/plans/active/e2e-page-tests/mgmt-13-topic-messages.md (deleted)
- .llm/plans/active/e2e-page-tests/mgmt-14-topic-message-edit.md (deleted)

---

### Session 4 - 2026-03-06

#### Prompt (Developer)
E2E Home Smoke Bootstrap

Implement the plan as specified, it is attached for your reference. Do NOT edit
the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark
them as in_progress as you work, starting with the first one. Don't stop until
you have completed all the to-dos.

#### Key Decisions

- Implement a minimal one-test home-page smoke path for both web and
  management-web through Make targets.
- Keep existing full-suite E2E targets unchanged and add narrowly scoped home
  targets.
- Verify the new targets through existing Make/API-gate orchestration.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- apps/api/src/controllers/authController.ts
- apps/api/src/test/auth-username.test.ts
- apps/management-api/src/test/createSuperAdminForTest.ts
- apps/management-api/src/test/management-admins-permissions.test.ts
- apps/management-api/src/test/management-api-rate-limit.test.ts
- apps/management-api/src/test/management-api.test.ts
- apps/management-api/src/test/management-buckets-messages.test.ts
- apps/management-api/src/test/management-users-permissions.test.ts
- package-lock.json
- tools/web/seed-e2e.mjs

---

### Session 5 - 2026-03-06

#### Prompt (Developer)
@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/20.txt fix

#### Key Decisions

- Fix the API-gate failures blocking `make e2e_test_home` by addressing the two
  failing username auth tests.
- Enable signup behavior explicitly for `auth-username` integration tests.
- Make `GET /auth/username-available` correctly treat authenticated users'
  current username as available even though the route is public.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- apps/web/package.json
- apps/web/playwright.config.ts
- apps/management-web/package.json
- apps/management-web/playwright.config.ts
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md

---

### Session 6 - 2026-03-06

#### Prompt (Developer)
Isolate E2E Home Ports

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Isolate E2E home app stack to dedicated `401x`/`411x` ports to avoid conflicts with normal dev instances.
- Auto-start required app processes from Playwright `webServer` so Make targets no longer depend on manually started apps.
- Keep existing Make target names and API-gate behavior; only change runtime orchestration and docs.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md
- .gitignore

---

### Session 7 - 2026-03-06

#### Prompt (Developer)
include the symlink. implement the plan

#### Key Decisions

- Add an alternate `make` command that runs home smoke tests and opens Playwright HTML reports automatically.
- Store report artifacts in timestamped, git-ignored directories under `.artifacts/e2e-reports/`.
- Create/update a `latest` symlink for quick navigation to the newest report bundle.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- apps/web/e2e/helpers/stepScreenshots.ts
- apps/management-web/e2e/helpers/stepScreenshots.ts
- apps/web/e2e/home.spec.ts
- apps/web/e2e/dashboard.spec.ts
- apps/management-web/e2e/home.spec.ts
- apps/management-web/e2e/dashboard.spec.ts
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md

---

### Session 8 - 2026-03-06

#### Prompt (Developer)
Step Screenshots In Report Mode

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Add reusable, env-gated step screenshot helpers for E2E tests in both web apps.
- Enable rich step screenshots only for report-focused runs to avoid bloating normal E2E runs.
- Attach screenshots to Playwright test artifacts so they appear in HTML report context.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md

---

### Session 9 - 2026-03-07

#### Prompt (Developer)
E2E Report Rotation Cap

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Add retention to report-focused E2E artifacts so `.artifacts/e2e-reports` keeps at most 10 timestamped report directories.
- Keep `latest` symlink behavior unchanged and ensure rotation excludes the symlink itself.
- Document retention behavior in the E2E runbook and verify with real report runs.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md
- apps/web/playwright.config.ts
- apps/management-web/playwright.config.ts
- makefiles/local/Makefile.local.e2e.mk
- docs/testing/E2E-PAGE-TESTING.md

---

### Session 10 - 2026-03-07

#### Prompt (Developer)
E2E Production Serving Mode

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Switch all E2E Playwright webServer commands to production-like `build + start` mode to reduce dev-only false positives.
- Keep all existing E2E command names and report/screenshot/rotation behavior intact.
- Update runbook language to document stability-mode-by-default and verify all E2E command paths.

#### Files Changed

- .llm/history/active/project-init/project-init-part-01.md

---

## Related Resources

- [Link to PR]
- [Link to related issues]
