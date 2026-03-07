# E2E Page Tests – COPY-PASTA

Use these prompts to parallelize detailed planning and implementation after
foundation and route normalization are complete.

## Parallel group A: Detailed plan generation (web)

`Use .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md as the template. Generate detailed implementation plans for these web placeholders only: [list specific web-*.md files]. Keep each output under 300 lines and include selectors, assertion matrix, seeded data mapping, and screenshot checkpoints.`

## Parallel group B: Detailed plan generation (management-web)

`Use .llm/plans/active/e2e-page-tests/02-detailed-plan-generation.md as the template. Generate detailed implementation plans for these management placeholders only: [list specific mgmt-*.md files]. Keep each output under 300 lines and include permissions matrix, CRUD matrix, selectors, and screenshot checkpoints.`

## Parallel group C: Web E2E implementation

`Implement Playwright tests for these web pages based on their detailed plans: [list files/routes]. Update docs only if workflow changes. Keep tests deterministic with seeded data, include failure screenshots/traces, and run relevant e2e targets.`

## Parallel group D: Management-web E2E implementation

`Implement Playwright tests for these management-web pages based on their detailed plans: [list files/routes]. Include super-admin vs scoped-admin behavior where applicable. Keep tests deterministic with seeded data, include failure screenshots/traces, and run relevant e2e targets.`

## Merge checklist for each parallel batch

- Route coverage maps exactly to current `page.tsx` files.
- No deprecated placeholders used for active implementation.
- Detailed plans exist before writing tests.
- Docs remain aligned with reporter/artifact expectations.
