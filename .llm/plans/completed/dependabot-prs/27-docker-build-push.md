# PR #27 – Bump docker/build-push-action from 6 to 7

## Scope

Apply the change from [PR #27](https://github.com/podverse/boilerplate/pull/27): bump
`docker/build-push-action` from v6 to v7 in the publish-alpha workflow. v7 removes deprecated
env vars and uses Node 24; verify build-and-push step still works.

## Steps

1. In **.github/workflows/publish-alpha.yml**, update the build-and-push step:
   - `uses: docker/build-push-action@v6` → `uses: docker/build-push-action@v7`.
2. Check [docker/build-push-action v7 release notes](https://github.com/docker/build-push-action/releases)
   for removed options (e.g. DOCKER_BUILD_NO_SUMMARY, DOCKER_BUILD_EXPORT_RETENTION_DAYS); remove any
   such env or inputs from the workflow.
3. No lockfile change. Optionally trigger the workflow to verify.

## Key files

- `.github/workflows/publish-alpha.yml` (step: Build and push Docker image)

## Verification

- Workflow file is valid YAML.
- If possible, run the Publish Alpha workflow and confirm the build-push step completes
  successfully.
