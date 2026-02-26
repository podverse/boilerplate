# Plan 26: Git hooks (Podverse-aligned)

## Scope

Set up local git hooks aligned with Podverse monorepo conventions: install script, pre-commit
(format staged files with Prettier via lint-staged), commit-msg (encourage GitHub issue
reference), and pre-push (block direct push to protected branch; enforce branch naming).
Hooks are installed via `npm run prepare` (so `npm install` installs them). No k8s.

## Steps

1. **Hook scripts directory**
   - Create `scripts/git-hooks/` with the following files (adapt from
     [podverse/scripts/git-hooks/](podverse/scripts/git-hooks/)).

2. **install-hooks.sh**
   - Copy from podverse or adapt: `SCRIPT_DIR` and `HOOKS_DIR` (repo root `.git/hooks`).
   - Copy `commit-msg`, `pre-commit`, `pre-push` from script dir to `HOOKS_DIR` and
     `chmod +x` each. Echo success message listing the three hooks.
   - Invoked by root `package.json` script `prepare` (see step 5).

3. **pre-commit**
   - Run **lint-staged** (Prettier on staged files). If `node_modules/.bin/lint-staged` is
     missing, exit 1 with "run npm install". Support Node on PATH; optionally support nvm
     or nix develop like podverse. Keep script minimal for boilerplate.

4. **commit-msg**
   - Read `$1` (commit message file). Allow merge commits. If message contains `#<digits>`
     (issue reference), exit 0. Otherwise: in interactive terminal, prompt to continue /
     add issue / abort; in non-interactive (GUI), block commit and tell user to add issue
     reference or use terminal. Use stderr for output so GUI tools show the message.

5. **pre-push**
   - **Protected branch**: `develop` only (boilerplate default branch). Block direct push to
     develop with clear message: use a PR to merge changes.
   - **Branch naming**: Allow `feature/*`, `fix/*`, `chore/*`, `docs/*`, `hotfix/*`,
     `release/*`. If current branch does not match, in interactive terminal offer override
     or abort; in non-interactive, block. Use stderr for output.
   - Adapt from podverse `pre-push`; reduce protected list to `develop` for boilerplate.

6. **Root package.json**
   - Add script: `"prepare": "bash scripts/git-hooks/install-hooks.sh"`.
   - Ensure **lint-staged** is in devDependencies and a `"lint-staged"` config exists (e.g.
     `"*.{ts,tsx,js,mjs,cjs,json,md,yml,yaml,scss,css}": "prettier --write"`). If plan 05 or
     lint setup already added it, only add `prepare` here.

7. **Docker / CI**
   - Add `scripts/git-hooks/` to `.dockerignore` so Docker builds do not run `prepare`
     (which would try to write to `.git/hooks`). Podverse does this; document in plan or
     in 08 if Makefile/docker context is defined there.

8. **Documentation**
   - In README or `docs/GITFLOW.md` (plan 09): mention that git hooks are installed on
     `npm install` via `prepare`; list pre-commit (format), commit-msg (issue ref),
     pre-push (no direct push to develop; branch naming). Bump script (plan 07) uses
     `--no-verify` when bumping so hooks do not block.

## Key files

- `scripts/git-hooks/install-hooks.sh`
- `scripts/git-hooks/pre-commit`
- `scripts/git-hooks/commit-msg`
- `scripts/git-hooks/pre-push`
- Root `package.json` (prepare, lint-staged config)
- `.dockerignore` (exclude scripts/git-hooks/)

## Verification

- After `npm install`, `.git/hooks/pre-commit`, `commit-msg`, `pre-push` exist and are
  executable. Committing with no issue ref shows prompt or blocks in GUI. Pushing to
  `develop` is blocked; pushing on `feature/foo` succeeds. Staged files are formatted by
  pre-commit (lint-staged). Bump script still works with `--no-verify`.
