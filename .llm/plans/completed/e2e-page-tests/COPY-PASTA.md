# E2E Page Tests – COPY-PASTA

Use these prompts to parallelize detailed-plan refinement and implementation
after foundation and route normalization are complete.

## Parallel group A: Detailed plan refinement (web)

`Use .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md as the template. Refine these existing web detailed plans only in .llm/plans/completed/e2e-page-tests: [list specific web-*.md files]. Keep each file under 300 lines and include selectors, assertion matrix, seeded/helper-created fixture mapping, report-mode screenshot checkpoints, and exact redirect/permission outcomes where known.`

## Parallel group B: Detailed plan refinement (management-web)

`Use .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md as the template. Refine these existing management-web detailed plans only in .llm/plans/completed/e2e-page-tests: [list specific mgmt-*.md files]. Keep each file under 300 lines and include permission/event_visibility branches, CRUD matrix, selectors, helper-created fixture requirements, and report-mode screenshot checkpoints.`

## Parallel group C: Web E2E implementation

`Implement Playwright tests for these web pages based on their current detailed plans: [list files/routes]. Update docs only if workflow changes. Keep tests deterministic with seeded/helper-created data, include failure screenshots/traces, and use the shared report-mode artifact model when visual QA review is required.`

## Parallel group D: Management-web E2E implementation

`Implement Playwright tests for these management-web pages based on their current detailed plans: [list files/routes]. Include super-admin vs scoped-admin behavior where applicable. Keep tests deterministic with seeded/helper-created data, include failure screenshots/traces, and use the shared report-mode artifact model when visual QA review is required.`

## Merge checklist for each parallel batch

- Route coverage maps exactly to current `page.tsx` files.
- No deprecated placeholders used for active implementation.
- Current detailed plans are updated before writing tests.
- Docs remain aligned with reporter/artifact expectations.
