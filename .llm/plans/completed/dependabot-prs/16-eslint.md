# PR #16 – Bump eslint from 9.39.3 to 10.0.2

## Scope

Apply the dependency update from [PR #16](https://github.com/podverse/boilerplate/pull/16): bump
`eslint` from 9.x to 10.0.2. ESLint 10 removes eslintrc support and has other breaking changes; the
repo already uses `eslint.config.mjs` (flat config). Update config and fix any new rule behavior or
deprecations.

## Steps

1. In **package.json** (root), update devDependencies: `"eslint": "^9.39.2"` → `"eslint": "^10.0.2"`.
2. Run `npm install` from repo root.
3. Review [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0);
   update `eslint.config.mjs` and any shared config or plugins if required.
4. Run `npm run lint` and `npm run lint:fix`; fix any new rule violations or config errors.
5. Run type-check and build to ensure no regressions.

## Key files

- `package.json` (root, devDependencies)
- `eslint.config.mjs` (root)

## Verification

- `npm run lint` passes with no new errors.
- `npm run type-check` and `npm run build` pass.
- `npm run test` passes.
