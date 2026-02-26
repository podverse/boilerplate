# Plan 10: Git labels and generation

## Scope

Add scripts to create/update GitHub labels: e.g. `scripts/github/setup-all-labels.sh` (and
optional `setup-labels.sh`, `remove-old-labels.sh`). Use a reduced label set for boilerplate:
bug, enhancement, docs, infra, ci, dependencies, priority:*, etc. Optionally a workflow that
applies labels on PR (e.g. pr-labeler).

## Steps

1. **Prerequisites**
   - Scripts require GitHub CLI (`gh`); check for `gh` and `gh auth status` at start; exit with
     clear message if missing.

2. **setup-all-labels.sh**
   - Create `scripts/github/setup-all-labels.sh` (executable).
   - Resolve repo from `gh repo view` or git remote.
   - Define a list of labels: name, color (hex), description. Include: bug, duplicate,
     enhancement, invalid, question, wontfix; technical-improvement; apps, packages, docs,
     infra, ci, scripts, tools; blocked; security; dependencies, docker; priority:critical,
     priority:high, priority:medium, priority:low. (tools/ exists as a placeholder with
     .gitkeep.)
   - For each label: create or update via `gh label create` (or API). Use idempotent behavior
     (create if missing, update if exists).
   - Print summary: created, updated, already correct.

3. **Optional: setup-labels.sh**
   - Thin wrapper or subset script if you want a smaller set for quick setup; document in
     comments.

4. **Optional: remove-old-labels.sh**
   - Script that removes obsolete label names (list in script); warn before delete. Document
     when to run.

5. **Optional: pr-labeler workflow**
   - Add `.github/workflows/pr-labeler.yml` (or include in ci.yml) that runs on pull_request
     (opened, synchronize) and sets labels based on files changed (e.g. apps/* → apps, infra/*
     → infra). Use a small config (path → label mapping) or an action like
     actions/labeler@v4 with a `.github/labeler.yml` config.

6. **Documentation**
   - Add `scripts/github/SCRIPTS-GITHUB.md` or section in main README: how to run setup-all-labels
     (e.g. `gh auth login`, then `./scripts/github/setup-all-labels.sh`).

## Key files

- `scripts/github/setup-all-labels.sh`
- Optional: `scripts/github/setup-labels.sh`, `remove-old-labels.sh`
- Optional: `.github/workflows/pr-labeler.yml`, `.github/labeler.yml`
- Optional: `scripts/github/SCRIPTS-GITHUB.md`

## Verification

- Run `./scripts/github/setup-all-labels.sh`; labels appear in the GitHub repo; running again
  is idempotent (no duplicate labels, updates if description/color changed).
- If pr-labeler is added: open a PR that touches only `apps/`; label "apps" is applied.
