# Plan 07: Bump version all script

## Scope

Add script `scripts/publish/bump-version.sh` that prompts for a new semver, updates root
package.json and all workspace package.json versions (e.g. via `npm version` and iterating
workspaces). Align with podverse `scripts/publish/bump-version.sh`. No publish step (no npm
publish or image push). Optionally commit and push version bump.

## Steps

1. **Create script**
   - `scripts/publish/bump-version.sh`: executable; shebang bash; `set -e`.
   - Resolve repo root (e.g. two levels up from `scripts/publish`).

2. **Pre-check**
   - Run `npm audit --omit=dev`; on failure, print error and exit 1 (do not bump if vulns
     exist).

3. **Current version**
   - Read root `package.json` version (e.g. with `node -e "require('./package.json').version"` or
     Node ESM readFileSync); print "Current version: X.Y.Z".

4. **Prompt**
   - `read -p "Enter next version (e.g., 1.2.3): " VERSION`.
   - Reject empty; reject non-semver (e.g. require regex ^[0-9]+\.[0-9]+\.[0-9]+$). Print error
     and exit 1 if invalid.

5. **Update root**
   - `npm version "$VERSION" --no-git-tag-version` in repo root.

6. **Update workspaces**
   - List workspaces (e.g. `npm query .workspace | jq -r '.[].location'` or parse
     package.json workspaces).
   - For each workspace, `cd "$REPO_ROOT/$ws"` and `npm version "$VERSION" --no-git-tag-version
     --allow-same-version`.
   - Return to repo root.

7. **Git commit and push (chosen: yes)**
   - Stage root and workspace package.json (and package-lock.json if present). Run
     `git commit --no-verify -m "chore: bump version to $VERSION"` and
     `git push --no-verify origin $(git branch --show-current)`. Document in script
     comments that commit/push is automatic (--no-verify to bypass hooks).

8. **Output**
   - Use color (e.g. GREEN/YELLOW/RED/NC) for messages; echo "Version bumped to X.Y.Z".

## Key files

- `scripts/publish/bump-version.sh`
- Optional: short note in README or docs/ about when to run and that it does not publish.

## Verification

- Run script; enter valid semver (e.g. 0.2.0); root and all workspace package.json versions
  match new version.
- Run with empty or invalid version; script exits 1 with clear message.
- If audit fails, script exits 1 before prompting.
