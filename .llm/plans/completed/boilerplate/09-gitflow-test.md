# Plan 09: Gitflow and /test

## Scope

Document the branch model (e.g. develop/main, feature branches) and add a CI workflow that runs
**only** when a maintainer comments **/test** on a PR (comment-triggered CI; no automatic run on
PR open/update or push). Steps: checkout, Node 24, npm ci, build packages (if any), lint,
type-check, build apps. No DB migrations step unless added later. Align with podverse
`.github/workflows/ci.yml`.

## Steps

1. **Documentation**
   - Add a short section to README or `docs/GITFLOW.md`: **default branch is develop** (PRs
     merge into develop); feature branches (e.g. feature/name, fix/name from start-feature.sh);
     CI runs **only** when a maintainer comments `/test` on a PR (comment-triggered CI).

2. **Workflow file**
   - Create `.github/workflows/ci.yml` (or `ci.yaml`).

3. **Triggers**
   - **On /test comment only:** `on.issue_comment.types`: [created]. When the comment is on a
     PR and body contains `/test` and author is OWNER/MEMBER/COLLABORATOR, run the validate
     job against the PR head. Do **not** use `pull_request` trigger; CI runs only on /test.
   - Do not trigger on push to main/develop or on PR open/update. Document in README/GITFLOW
     (include a short "Comment-Triggered CI" note).

4. **Job: validate (comment-triggered only)**
   - Single job triggered by issue_comment. Use actions/github-script to get PR head ref/sha,
     then checkout that ref. Steps: setup Node 24, npm ci, build packages (if root has
     `build:packages` run it; else `npm run build`), lint, type-check (if `type-check` exists),
     build apps. Use actions/checkout@v4 (or v6), actions/setup-node with node-version 24 and
     cache npm.
   - Add reaction to comment (e.g. rocket), post PR comment on success/failure, and set commit
     status (success/failure) on the PR head SHA.

5. **Skip DB migrations**
   - Do not add a "Verify database migrations" step unless/until boilerplate has a migrations
     script (plan 12 or later).

6. **Report steps**
   - On success: optional PR comment "CI Passed" with run URL; set commit status to success.
   - On failure: optional PR comment "CI Failed" with table of step outcomes; set commit status
     to failure.

## Key files

- `.github/workflows/ci.yml`
- README or `docs/GITFLOW.md`

## Verification

- Opening or updating a PR does **not** trigger the workflow.
- On a PR, a maintainer comment containing `/test` triggers the validate job against the PR
  head; status and comment appear on the PR.
