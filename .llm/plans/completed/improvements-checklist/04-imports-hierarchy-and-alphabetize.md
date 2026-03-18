# 04 – Imports hierarchy and alphabetize

## Scope

Enforce a consistent import order and hierarchy (Node built-ins, external packages, workspace
packages, relative imports) and alphabetize within groups. Fix all files that don’t comply, and
document the rule in CONTRIBUTING or AGENTS.md if missing.

## Steps

### 1. Confirm ESLint/Prettier rules

- Open ESLint config (e.g. `eslint.config.js` or `.eslintrc*`) and check for import-order rules
  (e.g. `import/order`, `simple-import-sort`, or plugin that enforces groups).
- Check Prettier or any “organize imports” setting that might reorder imports.
- Note the intended order: typically (1) Node built-ins, (2) external packages, (3) workspace
  packages (`@boilerplate/*`), (4) relative imports (parent before sibling, then same dir). Within
  each group, alphabetize by path/symbol.

### 2. Run lint and list violations

- From repo root run: `npm run lint` (or `./scripts/nix/with-env npm run lint` if using the
  Nix flake).
- If lint reports import order violations, capture the list of files (or run with `--fix` to see
  what would change). If there is no import-order rule, add one and run again to get the full
  list of files that need fixing.

### 3. Fix violations

- Run `npm run lint:fix` (or equivalent) to auto-fix import order where the rule supports it.
- For any file that can’t be auto-fixed, manually reorder imports to match the hierarchy and
  alphabetize within groups. Keep type-only imports on a separate line per project rules
  (e.g. `import type { X } from '...'`).
- Ensure no logical errors: default and namespace imports in the right group; side-effect
  imports (e.g. styles) typically last.

### 4. Document hierarchy

- If CONTRIBUTING.md or AGENTS.md doesn’t describe import order, add a short section: “Import
  order: built-ins, then external packages, then workspace packages, then relative imports;
  alphabetize within each group. Type-only imports on a separate line.”
- Reference the ESLint rule name so contributors know how it’s enforced.

### 5. Verify

- Run `npm run lint` again; it should pass.
- Spot-check a few touched files to ensure readability and correctness.

## Key files

- ESLint config (root or per-package)
- `.prettierrc` or Prettier config (if it affects imports)
- Any file that had import order violations
- `docs/` or `CONTRIBUTING.md` or `AGENTS.md` for documentation

## Verification

- `npm run lint` passes with no import-order violations.
- Documentation mentions import order and how it’s enforced (ESLint rule name).
