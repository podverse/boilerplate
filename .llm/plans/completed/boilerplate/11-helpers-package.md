# Plan 11: Move validate env helpers to helpers package

## Scope

Add `packages/helpers` (or `packages/helpers-config`): move startup env validation types and
logic from `apps/api/src/lib/startup/validation.ts` into the package. **API and web-sidecar**
both use the package for startup env validation (align with Podverse, where both api and
web/sidecar use helpers-config). API and web-sidecar import from `@boilerplate/helpers` (or
chosen scope); API keeps a thin entrypoint that calls the shared function. Enables reuse by
other apps (e.g. workers) and aligns with podverse packages layout. Web (Next.js) may depend on
the package later for shared types or logger; for this plan, consumers are API and web-sidecar.

## Steps

1. **Create package**
   - New workspace: `packages/helpers/package.json` with name `@boilerplate/helpers` (or
     `@boilerplate/helpers-config`), type module, main/types pointing to dist, scripts build,
     lint, clean. Add to root package.json workspaces (e.g. `"packages/*"` or list
     `packages/helpers`).

2. **Move types and logic**
   - Move `ValidationResult`, `ValidationSummary` and the validation functions (e.g.
     validateRequired, validateApiPort, validateAll, displayValidationResults) from
     `apps/api/src/lib/startup/validation.ts` into `packages/helpers/src/` (e.g.
     `packages/helpers/src/startup/validation.ts` or `env-validation.ts`).
   - Export `validateStartupRequirements` and the types from package entry (e.g.
     `packages/helpers/src/index.ts`).

3. **API entrypoint**
   - In `apps/api`, keep a small `src/lib/startup/validation.ts` that imports
     `validateStartupRequirements` from `@boilerplate/helpers` and re-exports it (or call it
     directly from the API entrypoint). No duplication of logic.

4. **Web-sidecar**
   - In `apps/web/sidecar`, add dependency on `@boilerplate/helpers`. Replace the current
     inline `validateStartup()` in `server.ts` with the shared validation helpers (e.g.
     `validateRequired`, `validatePositiveNumber` or equivalent, `displayValidationResults`).
     Sidecar startup validation runs before the server listens; no duplicate validation logic.

5. **Build order**
   - Root scripts: ensure `build:packages` (or equivalent) builds `packages/helpers` before
     apps; or document that `npm run build` in root builds workspaces in dependency order.
   - API package.json: add dependency on `@boilerplate/helpers` (workspace protocol or `*`).
   - Web-sidecar package.json: add dependency on `@boilerplate/helpers`. Both `apps/api` and
     `apps/web/sidecar` must build after `packages/helpers`.

6. **Lint and types**
   - Package uses same ESLint/TypeScript config as repo (extend from root or tsconfig.base).
   - Fix any lint/type errors after move.

## Key files

- `packages/helpers/package.json`
- `packages/helpers/src/startup/validation.ts` (or env-validation.ts)
- `packages/helpers/src/index.ts`
- `packages/helpers/tsconfig.json`
- `apps/api/package.json` (add dependency)
- `apps/api/src/lib/startup/validation.ts` (thin wrapper)
- `apps/web/sidecar/package.json` (add dependency)
- `apps/web/sidecar/src/server.ts` (use shared validation, remove inline validateStartup logic)
- Root `package.json` (workspaces include packages/helpers)

## Verification

- `npm run build` from root builds packages/helpers then apps/api and apps/web/sidecar; API
  startup still runs validation and fails fast on missing env.
- Sidecar startup runs shared validation and fails fast on missing/invalid env; no duplicate
  validation logic in sidecar.
- No duplicate validation logic in apps/api; single source in packages/helpers.
