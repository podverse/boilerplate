# Plan 28: GitHub repo setup (documentation)

## Goal

Document the one-time GitHub repository setup required by other plans: **labels** (plan 10),
**branch protection rules** (plans 09, 26), and optionally a **GitHub App** for CI or status
checks. This plan adds documentation and pointers so maintainers can configure the repo
correctly after the code and workflows are in place.

## Scope

- **Documentation only**: Add or extend a doc (e.g. `docs/GITHUB-SETUP.md` or a section in
  `docs/GITFLOW.md`) that describes how to configure GitHub for this repo.
- **No automation of branch protection or App creation** in this plan (those require org/repo
  admin and tokens); the doc gives step-by-step instructions.
- Satisfies the “required from other plans” setup: plan 10 (labels script exists; doc says
  how to run it), plan 09 (CI on PR to develop; doc says set default branch and protection),
  plan 26 (pre-push blocks direct push to develop; doc says enable branch protection so
  server-side enforcement matches).

## Steps

1. **Create or extend setup doc**
   - Create `docs/GITHUB-SETUP.md` (or add a “GitHub repository setup” section to
     `docs/GITFLOW.md` if that exists). The doc will cover labels, branch protection, and
     optional GitHub App.

2. **Labels (required by plan 10)**
   - Document that GitHub labels are created/updated by
     `scripts/github/setup-all-labels.sh`.
   - Steps: ensure GitHub CLI (`gh`) is installed; run `gh auth login`; from repo root run
     `./scripts/github/setup-all-labels.sh`. Link to `scripts/github/README.md`.
   - Note that the pr-labeler workflow (`.github/workflows/pr-labeler.yml`) applies labels
     from changed paths; labels must exist before opening PRs. Running the script is
     idempotent.

3. **Branch protection (required by plans 09 and 26)**
   - Document configuring **branch protection rules** for the default branch (`develop`).
   - Steps: GitHub repo → Settings → Branches → Add rule (or Edit rule) for branch name
     `develop`. Recommend: require a pull request before merging (at least one approval or
     allow bypass for admins per team policy); do not allow force pushes; optionally
     require status checks to pass if CI (plan 09) reports status. Restrict who can push
     to develop if desired.
   - Explain why: plan 26’s pre-push hook blocks direct push to develop locally; branch
     protection enforces the same rule on the server. Plan 09’s CI runs on PRs targeting
     develop; protection ensures changes land via PR so CI runs.

4. **Default branch**
   - In the same doc, state that the default branch should be **develop** (as in plan 09
     and 00-SUMMARY). Steps: Settings → General → Default branch → switch to `develop` if
     not already.

5. **GitHub App (optional)**
   - Add a short subsection “Optional: GitHub App” for teams that use a GitHub App for CI
     status checks, deployment, or /test automation. Document: create an App in the org
     (or user) settings; install it on this repo; store App ID and private key (or
     installation token) in secrets; link to GitHub docs for creating and installing
     Apps. If plan 09’s /test workflow is extended to use an App for posting status or
     comments, mention that here and point to the workflow file.

6. **README or docs index**
   - Add a line in README or in `docs/README.md` (if present) pointing to the GitHub
     setup doc so new maintainers find it (e.g. “For one-time GitHub configuration
     (labels, branch protection), see [docs/GITHUB-SETUP.md](docs/GITHUB-SETUP.md).”).

## Key files

- `docs/GITHUB-SETUP.md` (new) or extended `docs/GITFLOW.md`
- README or `docs/README.md` (link to setup doc)

## Verification

- The doc exists and describes: (1) running the labels script, (2) configuring branch
  protection for develop, (3) setting default branch to develop, (4) optional GitHub App.
- Doc references plan 10 (labels), plan 09 (CI), and plan 26 (pre-push / protected
  branch) where relevant.
- README or docs index links to the setup doc.

## Dependencies

- Run after **27** (project description). Depends on plan 10 (labels script and pr-labeler
  exist), plan 09 (CI and GITFLOW doc exist), and plan 26 (git hooks and GITFLOW mention
  protected branch). No code changes in 28; documentation only.
