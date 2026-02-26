# Alpha Publish

This document describes how alpha (release-candidate) Docker images are published for the Boilerplate monorepo.

## What the alpha branch is for

The **`alpha`** branch is the release-candidate branch. Default branch remains **`develop`**. When you merge from `develop` into `alpha` (or push directly to `alpha`), the **Publish Alpha** GitHub Action runs: it validates the repo (audit, build, lint, type-check) and then builds and pushes Docker images to GitHub Container Registry (GHCR). No Kubernetes or deployment is performed in this repo; the images are available for you to pull and run or deploy elsewhere.

## How to publish

1. **Merge to alpha** – Open a PR from `develop` into `alpha` (or push to `alpha`). The workflow [.github/workflows/publish-alpha.yml](../.github/workflows/publish-alpha.yml) runs on push to `alpha`.
2. **Manual run** – In GitHub: Actions → "Publish Alpha" → "Run workflow". Choose the `alpha` branch and run. You can optionally set **Version override** to a specific version string (e.g. `0.1.2-alpha.99`); when set, that value is used and the usual auto-increment from GHCR is skipped. Useful for re-publishing a specific version or testing.

## What gets published

Three images are built from the Dockerfiles under `infra/docker/local/`:

- **api** – Boilerplate API
- **web** – Next.js web app
- **web-sidecar** – Runtime-config sidecar for the web app

Each image is tagged with **`:alpha`** (always the latest alpha build) and with a **version tag** that is unique per run. The version is derived from the root `package.json` base version (e.g. `0.1.2`) plus an auto-incremented alpha suffix: `0.1.2-alpha.0`, `0.1.2-alpha.1`, and so on. You can pin a specific alpha build by using the version tag; use `:alpha` when you always want the latest.

## How to consume the images

Replace `OWNER` and `REPO` with your GitHub org/user and repo name (e.g. `myorg/boilerplate`).

```bash
# Pull by alpha tag (latest alpha build)
docker pull ghcr.io/OWNER/REPO/api:alpha
docker pull ghcr.io/OWNER/REPO/web:alpha
docker pull ghcr.io/OWNER/REPO/web-sidecar:alpha

# Or by version tag (e.g. a specific alpha build)
docker pull ghcr.io/OWNER/REPO/api:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/web:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/web-sidecar:0.1.2-alpha.2
```

For private repos, authenticate to GHCR first (e.g. `echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin`).

## Workflow reference

- **Workflow:** [.github/workflows/publish-alpha.yml](../.github/workflows/publish-alpha.yml) – Runs on push to `alpha` or via workflow_dispatch.

## Secrets and permissions

The workflow uses the built-in **GITHUB_TOKEN** to list GHCR tags (for version calculation) and to push images. The validate job has `packages: read` so it can query existing `*alpha.*` tags; the publish job has `packages: write`. No repository secrets are required unless your organization restricts default permissions. If listing tags fails (e.g. in a restricted org), you can run the workflow manually with **Version override** set to the desired tag. For details on repo secrets, see [repo-management/GITHUB-SETUP.md](repo-management/GITHUB-SETUP.md).
