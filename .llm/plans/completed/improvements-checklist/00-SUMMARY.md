# Improvements Checklist – Plan Set Summary

## Scope

This plan set implements the improvements and checks from
[temp/improvements-checklist.md](../../../temp/improvements-checklist.md). Each numbered plan is
runnable on its own. No product code or test changes are made when *creating* these plan files;
implementation happens when you execute each plan (e.g. via COPY-PASTA prompts).

## Plan files

| #   | File | Summary |
|-----|------|---------|
| 01  | [01-styles-inline-to-css-and-unused.md](01-styles-inline-to-css-and-unused.md) | Replace inline styles with CSS classes; remove unused styles/classes |
| 02  | [02-form-component-organization-audit.md](02-form-component-organization-audit.md) | Audit form components; ensure they live only under form directory |
| 03  | [03-reusable-elements-review.md](03-reusable-elements-review.md) | Review and consolidate mixins, primitives, UI, types, state→hooks |
| 04  | [04-imports-hierarchy-and-alphabetize.md](04-imports-hierarchy-and-alphabetize.md) | Enforce import order and hierarchy; fix violations |
| 05  | [05-constants-entity-lengths-routes.md](05-constants-entity-lengths-routes.md) | Entity lengths and route/path constants; reduce magic numbers |
| 06  | [06-schemas-grouping-audit.md](06-schemas-grouping-audit.md) | Confirm schemas grouped per app; document layout |
| 07  | [07-i18n-improvements.md](07-i18n-improvements.md) | Missing translations, consolidate i18n, check placeholders |
| 08  | [08-performance-review.md](08-performance-review.md) | Front-end and back-end performance review and low-effort wins |
| 09  | [09-testing-improvements.md](09-testing-improvements.md) | Add or improve unit, integration, and E2E tests |
| 10a | [10a-dependencies.md](10a-dependencies.md) | Dependency versions and lockfile updates |
| 10b | [10b-storybook.md](10b-storybook.md) | Storybook story updates and coverage |
| 11  | [11-crud-permission-helpers-refactor.md](11-crud-permission-helpers-refactor.md) | Group permission helpers; consider higher-order "can" functions |
| 12  | [12-skills-cursor-rules-review.md](12-skills-cursor-rules-review.md) | Review and align SKILLS and Cursor rules |

## Dependencies

- **05** touches `packages/orm`, `packages/helpers`, and app routes; may affect validation schemas.
- **07** touches all i18n (web, management-web, helpers-i18n); run scripts after changes.
- **03** may reference outcomes of 01/02 (styles and form layout).
- **11** is self-contained (api + web lib only).
- **12** is meta (skills/rules only).

## Execution

See [00-EXECUTION-ORDER.md](00-EXECUTION-ORDER.md) for phase order and parallelization. Use
[COPY-PASTA.md](COPY-PASTA.md) to run each plan.
