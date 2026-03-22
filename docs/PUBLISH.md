# Alpha Publish

This document describes how alpha (release-candidate) Docker images are published for the
Boilerplate monorepo.

## What the alpha branch is for

The **`alpha`** branch is the release-candidate branch. Default branch remains **`develop`**.
When you merge from `develop` into `alpha` (or push directly to `alpha`), the **Publish Alpha**
GitHub Action runs: it validates the repo (audit, build, lint, type-check), builds and pushes
Docker images to GitHub Container Registry (GHCR), then verifies the pushed tags exist.

No Kubernetes deployment is performed in this repo. The images are produced here, and deployment
must be handled by an external runtime or GitOps repo.

## How to publish

1. **Sync develop to alpha** – Keep `alpha` as a mirror of `develop`:

   ```bash
   ./scripts/publish/sync-develop-to-alpha.sh
   ```

   If your branch protection does not allow direct push to `alpha`, open a PR from `develop` to
   `alpha` instead.

2. **Merge to alpha** – Open a PR from `develop` into `alpha` (or push to `alpha`). The workflow [.github/workflows/publish-alpha.yml](../.github/workflows/publish-alpha.yml) runs on push to `alpha`.
3. **Manual run** – In GitHub: Actions → "Publish Alpha" → "Run workflow". Choose the `alpha` branch and run. You can optionally set **Version override** to a specific version string (e.g. `0.1.2-alpha.99`); when set, that value is used and the usual auto-increment from GHCR is skipped. Useful for re-publishing a specific version or testing.

When bumping version via `scripts/publish/bump-version.sh`, the script regenerates the lockfile
under Linux (Docker) before committing so CI gets the correct optional deps. If you add or change
dependencies by hand, run `./scripts/development/update-lockfile-linux.sh` and commit the updated
`package-lock.json`. See [Lockfile (Linux)](development/LOCKFILE-LINUX.md).

## What gets published

Six images are built from the Dockerfiles under `infra/docker/local/`:

- **api** – Boilerplate API
- **management-api** – Boilerplate management API
- **web** – Next.js web app
- **web-sidecar** – Runtime-config sidecar for the web app
- **management-web** – Next.js management web app
- **management-web-sidecar** – Runtime-config sidecar for the management web app

Each image is tagged with **`:alpha`** (always the latest alpha build) and with a **version tag**
that is unique per run. The version is derived from the root `package.json` base version (e.g.
`0.1.2`) plus an auto-incremented alpha suffix: `0.1.2-alpha.0`, `0.1.2-alpha.1`, and so on.
You can pin a specific alpha build by using the version tag; use `:alpha` when you always want
the latest.

## How to consume the images

Replace `OWNER` and `REPO` with your GitHub org/user and repo name (e.g. `myorg/boilerplate`).

```bash
# Pull by alpha tag (latest alpha build)
docker pull ghcr.io/OWNER/REPO/api:alpha
docker pull ghcr.io/OWNER/REPO/management-api:alpha
docker pull ghcr.io/OWNER/REPO/web:alpha
docker pull ghcr.io/OWNER/REPO/web-sidecar:alpha
docker pull ghcr.io/OWNER/REPO/management-web:alpha
docker pull ghcr.io/OWNER/REPO/management-web-sidecar:alpha

# Or by version tag (e.g. a specific alpha build)
docker pull ghcr.io/OWNER/REPO/api:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/management-api:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/web:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/web-sidecar:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/management-web:0.1.2-alpha.2
docker pull ghcr.io/OWNER/REPO/management-web-sidecar:0.1.2-alpha.2
```

For private repos, authenticate to GHCR first (e.g. `echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin`).

## Workflow reference

- **Workflow:** [.github/workflows/publish-alpha.yml](../.github/workflows/publish-alpha.yml) – Runs on push to `alpha` or via workflow_dispatch.

## Secrets and permissions

The workflow supports two tokens for GHCR tag discovery:

- `GHCR_REGISTRY_TOKEN` (recommended): repository secret with `packages:read`
- `GITHUB_TOKEN` (fallback): built-in token used if `GHCR_REGISTRY_TOKEN` is not set

If GHCR tag listing fails, the workflow exits with an actionable error and asks for one of:

- configure `GHCR_REGISTRY_TOKEN`, or
- re-run with **Version override** in manual dispatch

Pushing images still uses `GITHUB_TOKEN` with `packages:write` permissions in the publish job.
For repository setup details, see
[repo-management/GITHUB-SETUP.md](repo-management/GITHUB-SETUP.md).

## Deployment contract

- This repo's alpha pipeline is **publish-only**.
- The workflow publishes images and verifies tags; it does not apply Kubernetes manifests.
- `infra/k8s/alpha/` is scaffold-only and not a wired deployment target today.
- Consumers should reference immutable version tags (for example `0.1.2-alpha.3`) in their
  deployment repo and use `:alpha` only when "latest alpha" behavior is intended.
