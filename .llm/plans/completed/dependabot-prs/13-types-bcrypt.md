# PR #13 – Bump @types/bcrypt from 5.0.2 to 6.0.0

## Scope

Apply the dependency update from [PR #13](https://github.com/podverse/boilerplate/pull/13): bump
`@types/bcrypt` from 5.0.2 to 6.0.0 in workspace(s) that use bcrypt. Types-only change; runtime
bcrypt behavior is unchanged.

## Steps

1. In **apps/api/package.json** and **apps/management-api/package.json**, update devDependencies:
   - `"@types/bcrypt": "^5.0.2"` → `"@types/bcrypt": "^6.0.0"`.
2. Run `npm install` from repo root.
3. Run type-check and build; fix any type errors in bcrypt usage (e.g. hash/compare call sites) if
   the new types differ.
4. Run lint and tests.

## Key files

- `apps/api/package.json` (devDependencies)
- `apps/management-api/package.json` (devDependencies)
- Any src files that import bcrypt or use its types

## Verification

- `npm run type-check` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run test` passes (api and management-api).
