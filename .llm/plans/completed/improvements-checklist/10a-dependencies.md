# 10a – Dependencies

## Scope

Check dependency versions (e.g. `npm outdated`), decide upgrade policy, update the lockfile, and
fix any breaking changes. Ensure CI and Docker builds use the updated lockfile.

## Steps

### 1. Dependency audit

- Run `npm outdated` (or equivalent) from repo root. Review the list: which packages are
  behind, and by how much (patch/minor/major).
- Decide policy: e.g. apply all patch/minor updates, or only security-related, or a curated list.
  Document the decision (e.g. in a PR or in AGENTS.md).

### 2. Apply upgrades and fix breakage

- Update `package.json` (or workspace package.json files) for the chosen packages; run
  `npm install` to refresh the lockfile.
- Run the test suite and fix any breaking changes (e.g. API changes, new lint rules). If a major
  upgrade is done, follow the library’s migration guide.
- Commit the updated lockfile so CI and Docker builds use the same versions.

### 3. Verify

- `npm run build` and `npm run lint` pass after dependency updates.
- Tests pass.

## Key files

- Root `package.json` and `package-lock.json`; workspace `package.json` files

## Verification

- Dependencies at chosen versions; lockfile updated; tests and build pass.
