# PR #21 – Bump dev-dependencies group (7 updates)

## Scope

Apply the dependency updates from [PR #21](https://github.com/podverse/boilerplate/pull/21): bump
the dev-dependencies group: @types/node 24.10.15→24.11.0, eslint-plugin-storybook 10.2.13→10.2.14,
globals 17.3.0→17.4.0, @storybook/react, @storybook/react-vite, storybook, @storybook/addon-docs
10.2.13→10.2.14. All are patch/minor; low risk.

## Steps

1. In **package.json** (root), update devDependencies to the versions from the PR:
   - `@types/node`: `^24.11.0`
   - `eslint-plugin-storybook`: `^10.2.14`
   - `globals`: `^17.4.0`
   - Storybook-related packages (if present at root or in packages/ui): `^10.2.14` for
     storybook, @storybook/react, @storybook/react-vite, @storybook/addon-docs.
2. Run `npm install` from repo root.
3. Run type-check, lint, and build; fix any new type or lint issues (e.g. globals or Storybook).
4. Run tests. Optionally run Storybook to confirm UI.

## Key files

- `package.json` (root, devDependencies)
- `packages/ui/package.json` (if Storybook deps live there)

## Verification

- `npm run type-check` passes.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run test` passes.
- Optional: `npm run storybook` (if available) runs without errors.
