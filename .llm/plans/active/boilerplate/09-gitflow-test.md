# Plan 09: Gitflow and /test

## Scope

Document the branch model (e.g. develop/main, feature branches) and add a CI workflow that runs
on push to main/develop and when a maintainer comments **/test** on a PR. Steps: checkout, Node
24, npm ci, build packages (if any), lint, type-check, build apps. No DB migrations step unless
added later. Align with podverse `.github/workflows/ci.yml`.

## Steps

1. **Documentation**
   - Add a short section to README or `docs/GITFLOW.md`: **default branch is develop** (PRs
     merge into develop); feature branches (e.g. feature/name, fix/name from start-feature.sh);
     CI runs when a PR targets develop and when a maintainer comments `/test` on a PR.

2. **Workflow file**
   - Create `.github/workflows/ci.yml` (or `ci.yaml`).

3. **Triggers**
   - **On PR into develop:** `on.pull_request.branches`: [develop]; types: [opened,
     synchronize]. So validate runs when a PR is created or updated targeting develop.
   - **On /test comment:** `on.issue_comment.types`: [created]. When the comment is on a PR
     and body contains `/test` and author is OWNER/MEMBER/COLLABORATOR, run the same
     validate job against the PR head.
   - Do not trigger on push to main/develop; validate runs when a PR targets develop and when
     /test is used. Document in README/GITFLOW.

4. **Job: validate (on pull_request to develop)**
   - Single job that runs on pull_request (target branch develop): checkout the PR head
     (e.g. github.event.pull_request.head.sha), setup Node 24, npm ci, build packages (if
     root has `build:packages` run it; else `npm run build`), lint, type-check (if
     `type-check` exists), build apps. Use actions/checkout@v4 (or v6), actions/setup-node
     with node-version 24 and cache npm.

5. **Job: validate (on /test comment)**
   - Same steps as above; triggered when event is issue_comment, issue is a PR, comment
     body contains `/test`, and author is OWNER/MEMBER/COLLABORATOR.
   - Checkout the PR head (use actions/github-script to get PR head ref/sha, then checkout
     that ref).
   - Optionally add reaction to comment (e.g. rocket), post PR comment on success/failure,
     and set commit status (success/failure) on the PR head SHA.

6. **Skip DB migrations**
   - Do not add a "Verify database migrations" step unless/until boilerplate has a migrations
     script (plan 12 or later).

7. **Report steps**
   - On success: optional PR comment "CI Passed" with run URL; set commit status to success.
   - On failure: optional PR comment "CI Failed" with table of step outcomes; set commit status
     to failure.

## Key files

- `.github/workflows/ci.yml`
- README or `docs/GITFLOW.md`

## Verification

- Opening or updating a PR that targets develop triggers the workflow; all steps pass when
  repo is healthy.
- On a PR, a maintainer comment containing `/test` triggers the same job against the PR head;
  status and optional comment appear on the PR.
