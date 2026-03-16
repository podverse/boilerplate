# PR #26 – Bump docker/setup-buildx-action from 3 to 4

## Scope

Apply the change from [PR #26](https://github.com/podverse/boilerplate/pull/26): bump
`docker/setup-buildx-action` from v3 to v4 in the publish-alpha workflow. v4 uses Node 24 and may
remove deprecated inputs; verify workflow still runs.

## Steps

1. In **.github/workflows/publish-alpha.yml**, update the step that uses setup-buildx:
   - `uses: docker/setup-buildx-action@v3` → `uses: docker/setup-buildx-action@v4`.
2. Check [docker/setup-buildx-action v4 release notes](https://github.com/docker/setup-buildx-action/releases)
   for removed/deprecated inputs; remove or replace any used in this workflow.
3. No lockfile change; workflow is YAML only. Optionally trigger a run on alpha or workflow_dispatch
   to verify.

## Key files

- `.github/workflows/publish-alpha.yml` (single step: Set up Docker Buildx)

## Verification

- Workflow file is valid YAML (no syntax errors).
- If possible, run the Publish Alpha workflow (e.g. workflow_dispatch) and confirm the
  setup-buildx step succeeds.
