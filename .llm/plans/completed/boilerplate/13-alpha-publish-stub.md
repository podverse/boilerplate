# Plan 13: Alpha publish (images on merge to alpha)

## Scope

When all boilerplate phases are complete, **merging into the `alpha` branch** produces working
Docker images published to a registry (e.g. GitHub Container Registry). No k8s deploy in this
repo. The `alpha` branch is the release-candidate branch; merging from `develop` into `alpha`
triggers the publish workflow.

## Steps

1. **Branch model**
   - Document that `alpha` exists as the release-candidate branch. PRs target `alpha` when
     cutting a release; the workflow runs on push to `alpha`. Default branch remains
     `develop`.

2. **Workflow: `.github/workflows/publish-alpha.yml`**
   - **Trigger:** `on.push.branches: [alpha]`. Optionally `workflow_dispatch` for manual run
     with optional `version_override` input.
   - **Job 1 – validate:** Checkout, Node 24, `npm ci`, `npm audit --omit=dev`, `npm run
     build:packages`, `npm run lint`, `npm run type-check`, copy `apps/web/.env.example` to
     `apps/web/.env.local`, `npm run build:apps`. Then "Calculate unified version": base
     version from package.json, query GHCR for existing `{base}-alpha.N` tags, set version to
     `{base}-alpha.0` or `{base}-alpha.(max+1)`; if `version_override` is set, use it and
     skip GHCR. Permissions: `contents: read`, `packages: read`.
   - **Job 2 – publish images:** Needs validate. Matrix over apps: `api`, `web`, `web-sidecar`.
     Use existing Dockerfiles under `infra/docker/local/`. Login to GHCR with
     `docker/login-action` (e.g. `GITHUB_TOKEN`). Build and push each image with tags
     `ghcr.io/${{ github.repository }}/<app>:<version>` and `ghcr.io/.../<app>:alpha`.
     Permissions: `contents: read`, `packages: write`. Boilerplate has no base-image layer;
     single-stage builds from repo root are sufficient.

3. **Documentation**
   - Add or extend `docs/PUBLISH.md`: what the `alpha` branch is for; that merging to
     `alpha` runs the workflow and publishes images to GHCR; version tags as
     `0.1.2-alpha.0`, `0.1.2-alpha.1`, etc., with `:alpha` as latest; how to consume images
     (e.g. `docker pull ghcr.io/org/boilerplate/api:alpha`); optional manual run and
     version override via `workflow_dispatch`; link to the workflow file.

## Key files

- `.github/workflows/publish-alpha.yml`
- `docs/PUBLISH.md`

## Verification

- Pushing (or merging) to `alpha` triggers the workflow; validate job passes; images are
  built and pushed to the registry with tag `:alpha` and a unique version tag (e.g.
  `0.1.2-alpha.N`).
- `docs/PUBLISH.md` describes the alpha flow, version tags, and how to pull/use the images.
