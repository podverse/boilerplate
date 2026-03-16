# PR #14 – Bump vitest from 3.2.4 to 4.0.18

## Scope

Apply the dependency update from [PR #14](https://github.com/podverse/boilerplate/pull/14): bump
`vitest` from 3.2.4 to 4.0.18 in workspaces that run tests. Vitest 4 may introduce breaking changes
or config differences; follow [Vitest migration guidance](https://vitest.dev/guide/migration) and
fix any failing tests or config.

## Steps

1. In **package.json** (root), **apps/api/package.json**, and **apps/management-api/package.json**,
   update vitest devDependency to `"vitest": "^4.0.18"` where present.
2. Run `npm install` from repo root.
3. Review vitest config (e.g. in apps or root); adjust for Vitest 4 if needed.
4. Run `npm run test` and fix any failing tests or deprecation warnings.
5. Run full lint and build.

## Key files

- `package.json` (if vitest is at root)
- `apps/api/package.json` (devDependencies)
- `apps/management-api/package.json` (devDependencies)
- `apps/api/src/test/**` and `apps/management-api/src/test/**` (and any vitest config files)

## Verification

- `npm run test` passes (api and management-api).
- `npm run type-check` and `npm run build` pass.
- `npm run lint` passes.
