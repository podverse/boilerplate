# PR #18 – Bump @types/supertest from 6.0.3 to 7.2.0

## Scope

Apply the dependency update from [PR #18](https://github.com/podverse/boilerplate/pull/18): bump
`@types/supertest` from 6.0.x to 7.2.0 in workspaces that use supertest for integration tests.
Types-only change; fix any type errors in test code if the new definitions differ.

## Steps

1. In **apps/api/package.json** and **apps/management-api/package.json**, update devDependencies:
   - `"@types/supertest": "^6.0.2"` (or current) → `"@types/supertest": "^7.2.0"`.
2. Run `npm install` from repo root.
3. Run type-check; fix any supertest-related type errors in test files (e.g. request/expect
   chaining).
4. Run lint, build, and tests.

## Key files

- `apps/api/package.json` (devDependencies)
- `apps/management-api/package.json` (devDependencies)
- `apps/api/src/test/**` and `apps/management-api/src/test/**` (supertest usage)

## Verification

- `npm run type-check` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run test` passes (api and management-api).
