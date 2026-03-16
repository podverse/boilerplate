# PR #28 – Bump docker/login-action from 3 to 4

## Scope

Apply the change from [PR #28](https://github.com/podverse/boilerplate/pull/28): bump
`docker/login-action` from v3 to v4 in the publish-alpha workflow. v4 uses Node 24 and updated
tooling; verify GHCR login still works.

## Steps

1. In **.github/workflows/publish-alpha.yml**, update the login step:
   - `uses: docker/login-action@v3` → `uses: docker/login-action@v4`.
2. Check [docker/login-action v4 release notes](https://github.com/docker/login-action/releases)
   for any input/output changes; adjust the step if the workflow uses optional inputs.
3. No lockfile change. Optionally trigger the workflow to verify.

## Key files

- `.github/workflows/publish-alpha.yml` (step: Login to GHCR)

## Verification

- Workflow file is valid YAML.
- If possible, run the Publish Alpha workflow and confirm the login step succeeds and the
  subsequent build-push step can push to GHCR.
