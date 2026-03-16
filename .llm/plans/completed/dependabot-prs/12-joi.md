# PR #12 – Bump joi from 17.13.3 to 18.0.2

## Scope

Apply the dependency update from [PR #12](https://github.com/podverse/boilerplate/pull/12): bump
`joi` from 17.13.3 to 18.0.2 in apps that use it for validation. Joi 18 may include breaking changes
(e.g. schema or API differences); validate usage and fix any incompatibilities.

## Steps

1. In **apps/api/package.json** and **apps/management-api/package.json**, update dependencies:
   - `"joi": "^17.13.3"` → `"joi": "^18.0.2"`.
2. Run `npm install` from repo root.
3. Search for `joi` / `Joi` usage in `apps/api/src` and `apps/management-api/src`; check
   [joi 18 release notes](https://github.com/hapijs/joi/releases) for breaking changes and adjust
   schemas or API calls as needed.
4. Run type-check, lint, build, and tests.

## Key files

- `apps/api/package.json`
- `apps/management-api/package.json`
- Validation/schema code in both apps that imports or uses joi

## Verification

- `npm run type-check` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run test` passes (api and management-api integration tests).
