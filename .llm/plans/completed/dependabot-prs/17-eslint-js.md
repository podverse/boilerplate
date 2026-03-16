# PR #17 – Bump @eslint/js from 9.39.3 to 10.0.1

## Scope

Apply the dependency update from [PR #17](https://github.com/podverse/boilerplate/pull/17): bump
`@eslint/js` from 9.39.x to 10.0.1. Do this **after** completing 16-eslint.md (eslint 10). @eslint/js
10 aligns with ESLint 10 and may require config or recommended rule updates.

## Steps

1. In **package.json** (root), update devDependencies: `"@eslint/js": "^9.39.2"` →
   `"@eslint/js": "^10.0.1"`.
2. Run `npm install` from repo root.
3. If `eslint.config.mjs` uses `@eslint/js` or `js.configs.recommended`, check compatibility with
   v10 and adjust as needed.
4. Run `npm run lint` and fix any new issues.
5. Run type-check, build, and test.

## Key files

- `package.json` (root, devDependencies)
- `eslint.config.mjs` (if it references @eslint/js)

## Verification

- `npm run lint` passes.
- `npm run type-check` and `npm run build` pass.
- `npm run test` passes.
