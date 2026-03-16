# PR #15 – Bump uuid from 11.1.0 to 13.0.0

## Scope

Apply the dependency update from [PR #15](https://github.com/podverse/boilerplate/pull/15): bump
`uuid` from 11.1.0 to 13.0.0. UUID 12+ drops CommonJS and Node 16; v13 makes browser exports the
default. Ensure ESM usage and imports are correct in orm, management-orm, and generate-data.

## Steps

1. In **packages/orm/package.json**, **packages/management-orm/package.json**, and
   **tools/generate-data/package.json**, update the `uuid` dependency to `"^13.0.0"`.
2. Run `npm install` from repo root.
3. Check all `uuid` import/usage in those packages (e.g. `import { v4 } from 'uuid'`); adjust for
   any API or export changes in uuid 13 if needed.
4. Run type-check, build, lint, and tests for affected workspaces and apps that depend on them.

## Key files

- `packages/orm/package.json`
- `packages/management-orm/package.json`
- `tools/generate-data/package.json`
- Source files in those packages that import or use uuid

## Verification

- `npm run type-check` passes.
- `npm run build` passes (packages and apps).
- `npm run lint` passes.
- `npm run test` passes.
