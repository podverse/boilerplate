# Execution order – Dependabot PRs

Run plans **one at a time** in this order. Wait for each to complete (lint, build, test pass) before
starting the next.

## Phase 1 – Low-risk patches

1. **29-production-patch.md** – Production deps: dedent, pg, nodemailer (patch/minor).
2. **21-dev-deps.md** – Dev-deps group: @types/node, storybook, globals, etc.

## Phase 2 – Docker actions (publish-alpha workflow)

Run in sequence (same workflow file):

3. **26-docker-setup-buildx.md** – docker/setup-buildx-action 3→4
4. **28-docker-login.md** – docker/login-action 3→4
5. **27-docker-build-push.md** – docker/build-push-action 6→7

## Phase 3 – Types-only (devDependencies)

6. **11-types-nodemailer.md** – @types/nodemailer 6→7
7. **13-types-bcrypt.md** – @types/bcrypt 5→6
8. **18-types-supertest.md** – @types/supertest 6→7

## Phase 4 – Major upgrades (possible breaking changes)

9. **12-joi.md** – joi 17→18 (validate API usage).
10. **15-uuid.md** – uuid 11→13 (CJS removed; orm, management-orm, generate-data).
11. **14-vitest.md** – vitest 3→4 (api + management-api).
12. **16-eslint.md** – eslint 9→10 (flat config already in use).
13. **17-eslint-js.md** – @eslint/js 9→10 (do after 16).

## Copy-pasta

Use **COPY-PASTA.md** to paste the prompt for each plan when asking the agent to implement it.
