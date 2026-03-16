# PR #29 – Bump production-minor-patch group (dedent, pg, nodemailer)

## Scope

Apply the dependency updates from [PR #29](https://github.com/podverse/boilerplate/pull/29): bump
dedent 1.7.1→1.7.2, pg 8.19.0→8.20.0, nodemailer 8.0.1→8.0.2 across the workspaces that declare
them. Patch/minor only; low risk.

## Steps

1. Update versions in the following package.json files:
   - **package.json** (root): `pg` in devDependencies to `^8.20.0` (if present).
   - **packages/orm/package.json**: `dedent` → `^1.7.2`, `pg` → `^8.20.0`.
   - **apps/api/package.json**: `nodemailer` → `^8.0.2`; `pg` in devDependencies → `^8.20.0` if
     present.
   - **apps/management-api/package.json**: `pg` in devDependencies → `^8.20.0` if present.
   - **packages/management-orm/package.json**: `pg` → `^8.20.0`.
2. Run `npm install` from repo root to refresh the lockfile.
3. Run type-check, lint, build, and tests. Fix any issues (e.g. pg onConnect or nodemailer
   behavior) if release notes indicate API changes.

## Key files

- `package.json` (root)
- `packages/orm/package.json`
- `apps/api/package.json`
- `apps/management-api/package.json`
- `packages/management-orm/package.json`

## Verification

- `npm run type-check` passes.
- `npm run build` passes (packages and apps).
- `npm run lint` passes.
- `npm run test` passes.
- If the repo uses `make sync_lockfile` or similar, run it and commit updated
  `package-lock.json`.
