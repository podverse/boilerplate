# PR #11 – Bump @types/nodemailer from 6.4.23 to 7.0.11

## Scope

Apply the dependency update from [PR #11](https://github.com/podverse/boilerplate/pull/11): bump
`@types/nodemailer` from 6.4.x to 7.0.11 in workspace(s) that use nodemailer. Types-only change;
runtime behavior of nodemailer is unchanged.

## Steps

1. In **apps/api/package.json**, update devDependencies:
   - `"@types/nodemailer": "^6.4.17"` (or current) → `"@types/nodemailer": "^7.0.11"`.
2. Run `npm install` from repo root to refresh lockfile.
3. Run type-check and build; fix any type errors in api code that uses nodemailer (e.g. mailer
   usage) if the new types expose stricter or different signatures.
4. Run lint and tests.

## Key files

- `apps/api/package.json` (devDependencies)
- Any `apps/api/src` files that import or use nodemailer types

## Verification

- `npm run type-check` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run test` passes (api and management-api if applicable).
