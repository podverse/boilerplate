# Summary – Dependabot PR plan set

## Scope

This plan set covers the work required to complete each of 13 Dependabot PRs in the
podverse/boilerplate repo. Each plan is **run one at a time**; do not combine multiple PRs in a
single implementation pass.

## Plan files (PR → file)

| PR   | Plan file                 | Dependency / change |
|------|---------------------------|----------------------|
| #29  | 29-production-patch.md    | dedent, pg, nodemailer (patch/minor) |
| #28  | 28-docker-login.md        | docker/login-action 3→4 |
| #27  | 27-docker-build-push.md   | docker/build-push-action 6→7 |
| #26  | 26-docker-setup-buildx.md | docker/setup-buildx-action 3→4 |
| #21  | 21-dev-deps.md            | @types/node, storybook, globals, etc. |
| #18  | 18-types-supertest.md     | @types/supertest 6→7 |
| #17  | 17-eslint-js.md           | @eslint/js 9→10 |
| #16  | 16-eslint.md              | eslint 9→10 |
| #15  | 15-uuid.md                | uuid 11→13 |
| #14  | 14-vitest.md              | vitest 3→4 |
| #13  | 13-types-bcrypt.md        | @types/bcrypt 5→6 |
| #12  | 12-joi.md                 | joi 17→18 |
| #11  | 11-types-nodemailer.md    | @types/nodemailer 6→7 |

## Execution order

See **00-EXECUTION-ORDER.md**. Recommended order: 29 → 21 → 26 → 28 → 27 → 11 → 13 → 18 → 12 →
15 → 14 → 16 → 17.

## Decisions

- One plan per PR so each can be merged (or backported) independently.
- Docker actions (26, 28, 27) are applied to `.github/workflows/publish-alpha.yml` only; CI
  workflow does not use Docker actions.
- ESLint 16 and 17: repo already uses `eslint.config.mjs` (flat config); ESLint 10 migration
  may require config or rule updates.

## How to run

1. Open **COPY-PASTA.md**.
2. Copy the prompt for the next plan in execution order.
3. Paste into the agent and run; wait for lint/build/test to pass.
4. Repeat for the next plan.
