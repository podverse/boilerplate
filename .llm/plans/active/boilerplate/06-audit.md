# Plan 06: Audit script

## Scope

Add script `scripts/audit/audit.sh` that runs `npm audit --omit=dev` with optional `--fix`.
Exit 1 when vulnerabilities are found and `--fix` was not used. Mirror podverse
`scripts/audit/audit.sh`.

## Steps

1. **Create script**
   - `scripts/audit/audit.sh`: executable (`chmod +x`).
   - Shebang: `#!/bin/bash`; `set -e`.
   - Resolve repo root: `SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"` (so
     from `scripts/audit/`, SCRIPT_DIR is the audit dir), then
     `REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"` (two levels up from `scripts/audit/` =
     repo root). Then `cd "$REPO_ROOT"`.

2. **--fix flag**
   - If first arg is `--fix`, run `npm audit fix --omit=dev --workspaces || true`, then
     continue to full audit.
   - Otherwise run only `npm audit --omit=dev`.

3. **Exit code**
   - After running `npm audit --omit=dev`: if jq is available, parse audit JSON for
     `.metadata.vulnerabilities.total`; if total > 0, print a short message (e.g. "Found N
     vulnerabilities", "Run .../audit.sh --fix to attempt automatic fixes") and exit 1.
   - If jq is not available, rely on npm audit exit code (npm exits non-zero when vulns
     exist); optionally print a note that jq is needed for a count summary.

4. **Output**
   - Echo a title (e.g. "=== Boilerplate Dependency Audit ==="), run audit, echo "=== Audit
     Complete ===" and optional summary.

## Key files

- `scripts/audit/audit.sh`

## Verification

- `./scripts/audit/audit.sh` runs and exits 0 when there are no vulnerabilities; exits 1 when
  there are (or when npm audit fails).
- `./scripts/audit/audit.sh --fix` runs audit fix then full audit; same exit logic.
