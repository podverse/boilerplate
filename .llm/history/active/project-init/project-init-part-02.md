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
