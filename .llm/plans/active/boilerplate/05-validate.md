# Plan 05: Validate (Make target)

## Scope

Add a Make target `validate` (and optionally `validate_docker`) that runs the same checks CI will
run: npm audit, build packages (when present), lint, type-check, env setup for web, build apps.
Adapt from podverse Makefile; no k8s. Optionally build Docker images after validate.

## Steps

1. **Root Makefile**
   - Create or update root `Makefile` (or ensure it exists and is included by a top-level Makefile).
   - Use bash for recipe shell where needed (`SHELL := /bin/bash` or similar for portability).

2. **validate target**
   - Step 1: `npm audit --omit=dev` (fail the target if audit fails).
   - Step 2: If `packages/` exists and root has a `build:packages` script, run `npm run
     build:packages`; otherwise skip or run `npm run build` for workspaces.
   - Step 3: `npm run lint`.
   - Step 4: If root has `type-check` script, run `npm run type-check`; otherwise run `tsc
     --noEmit` in each workspace that has tsconfig (or skip if not defined).
   - Step 5: Set up env for web: copy to `apps/web/.env.local` (preferred for Next.js local
     overrides) from `apps/web/.env.example` or from `infra/config/env-templates/web.env.example`
     so build has required vars. Document in Makefile comments.
   - Step 6: Build apps: `npm run build` (or `npm run build:apps` if defined).
   - Echo clear step labels (e.g. "Step 1/6: Security audit...") and final "All checks passed!".

3. **validate_docker (optional)**
   - Depends on `validate`.
   - Build Docker images for api, web, sidecar using the Dockerfiles from plan 02 (e.g.
     `docker build -f infra/docker/local/api/Dockerfile -t boilerplate-api:test .` and similar).
   - No workers or management apps; just api, web, web-sidecar.
   - Echo success when all images build.

4. **Integration with plan 08**
   - Plan 08 runs after this plan and extends the same root Makefile (audit, local_* targets).
   - Do not run plan 05 and plan 08 in parallel; this plan creates/updates the Makefile first.
   - Ensure `validate` and `validate_docker` are phony and documented in README or Makefile
     comments.

## Key files

- `Makefile` (root)

## Verification

- From repo root: `make validate` runs audit, build, lint, type-check, env setup, and app build;
  exits 0 when all pass; exits non-zero on first failure.
- `make validate_docker` (if implemented) builds api, web, and sidecar images and exits 0.
