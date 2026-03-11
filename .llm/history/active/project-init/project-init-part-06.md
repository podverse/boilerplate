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
