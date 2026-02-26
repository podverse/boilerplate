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
   - **Trigger:** `on.push.branches: [alpha]`. Optionally `workflow_dispatch` for manual run.
   - **Job 1 – validate:** Checkout, Node 24, `npm ci`, `npm audit --omit=dev`, `npm run
     build:packages`, `npm run lint`, `npm run type-check`, copy `apps/web/.env.example` to
     `apps/web/.env.local`, `npm run build:apps`. Same checks as CI so only validated code
     gets published.
   - **Job 2 – publish images:** Needs validate. Matrix over apps: `api`, `web`, `web-sidecar`.
     Use existing Dockerfiles under `infra/docker/local/` (api/Dockerfile, web/Dockerfile,
     web-sidecar/Dockerfile). Login to GHCR with `docker/login-action` (e.g. `GITHUB_TOKEN`
     or dedicated secret). Build and push each image with tags
     `ghcr.io/${{ github.repository }}/<app>:alpha` and optionally a versioned tag from
     root `package.json`. Boilerplate has no base-image layer; single-stage builds from repo
     root are sufficient.

3. **Script: `scripts/publish/alpha-publish.sh`**
   - Replace stub. Either (a) document the same steps and point to "trigger by merging to
     alpha", or (b) optionally run audit, build:packages, build:apps, and docker build
     locally with push when e.g. `REGISTRY` and credentials are set. Primary path is CI;
     script is for documentation or optional local publish.

4. **Documentation**
   - Add or extend `docs/PUBLISH.md`: what the `alpha` branch is for; that merging to
     `alpha` runs the workflow and publishes images to GHCR; how to consume images (e.g.
     `docker pull ghcr.io/org/boilerplate-api:alpha`); optional manual run via
     `workflow_dispatch`; link to the workflow file and script.

## Key files

- `.github/workflows/publish-alpha.yml`
- `scripts/publish/alpha-publish.sh`
- `docs/PUBLISH.md` (or README section)
- Optional: Make target `alpha-publish` that runs the script

## Verification

- Pushing (or merging) to `alpha` triggers the workflow; validate job passes; images are
  built and pushed to the registry with tag `alpha`.
- `docs/PUBLISH.md` describes the alpha flow and how to pull/use the images.
- Running `./scripts/publish/alpha-publish.sh` either documents the flow or performs
  local build/push when configured.
