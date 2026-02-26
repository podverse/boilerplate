# Plan 29: Dependabot setup

## Goal

Enable GitHub Dependabot for npm, Docker, and GitHub Actions so dependency and image updates are proposed as pull requests against `develop`, with appropriate labels and grouping. Align with Podverse’s Dependabot pattern; scope to boilerplate’s structure (npm workspaces, Dockerfiles under `infra/docker/local/`, Actions in `.github/`).

## Scope

- Add `.github/dependabot.yml`: npm at repo root (with grouping), Docker for each image directory under `infra/docker/local/` (api, web, web-sidecar; optionally management-api, management-web if present), and github-actions at repo root. Target branch `develop`; weekly schedule; labels `dependencies` and `docker` where applicable; Node LTS policy for Docker (even versions only).
- Add `docs/repo-management/DEPENDABOT.md`: describe the config, schedule, grouping strategy, Node LTS policy for Docker, and label usage. Link to [docs/repo-management/GITHUB-LABELS.md](docs/repo-management/GITHUB-LABELS.md).

## Steps

1. **Create `.github/dependabot.yml`**
   - `version: 2`, `updates:` list:
   - **npm** – `package-ecosystem: "npm"`, `directory: "/"`, `target-branch: "develop"`. Schedule: `interval: "weekly"`, `day: "monday"`, `time: "08:00"`, `timezone: "America/Chicago"` (or match Podverse). `open-pull-requests-limit: 10`. `labels: ["dependencies"]`. `commit-message: prefix: "chore(deps)"`. Optional `ignore` for `@types/node` non-LTS versions if desired. **Groups:** `production-minor-patch` (version-updates, patterns `*`, exclude `@types/*`, `eslint*`, `typescript`, update-types minor/patch); `typescript-ecosystem` (patterns `typescript`, `@types/*`, `eslint*`); `dev-dependencies` (dependency-type development, minor/patch).
   - **Docker** – One entry per directory that contains a Dockerfile: `infra/docker/local/api`, `infra/docker/local/web`, `infra/docker/local/web-sidecar`. Each: `package-ecosystem: "docker"`, `directory: "/infra/docker/local/<name>"`, `target-branch: "develop"`, weekly schedule, `labels: ["dependencies", "docker"]`. For each, add `ignore` for `node` with versions `["19.x", "21.x", "23.x", "25.x", "27.x", "29.x"]` (Node LTS = even versions only).
   - **github-actions** – `package-ecosystem: "github-actions"`, `directory: "/"`, `target-branch: "develop"`, weekly schedule, `labels: ["dependencies"]`.

2. **Create `docs/repo-management/DEPENDABOT.md`**
   - **Overview:** Dependabot opens PRs for dependency and image updates; config lives in `.github/dependabot.yml`.
   - **Update schedule:** Weekly (e.g. Mondays 08:00 CT).
   - **Ecosystem coverage:** (1) npm at root (workspace packages), grouping as above. (2) Docker images in `infra/docker/local/api`, `infra/docker/local/web`, `infra/docker/local/web-sidecar` (and optionally `management-api`, `management-web` if those apps exist); Node LTS policy (even versions only; ignore odd). (3) GitHub Actions in `.github/workflows/`.
   - **Labels:** `dependencies` on all Dependabot PRs; `docker` on Docker image PRs. Note that the PR labeler may also add `ci` or `infra` based on changed paths.
   - Link to [docs/repo-management/GITHUB-LABELS.md](docs/repo-management/GITHUB-LABELS.md) for full label reference.
   - Short **Node.js version policy** note: Docker images use Node LTS (even major versions only).

3. **Optional**
   - Add a line in [README.md](README.md) or [docs/repo-management/GITHUB-SETUP.md](docs/repo-management/GITHUB-SETUP.md) pointing to `docs/repo-management/DEPENDABOT.md` for dependency update policy.

## Key files

- `.github/dependabot.yml`
- `docs/repo-management/DEPENDABOT.md`

## Verification

- `.github/dependabot.yml` exists and is valid (GitHub will validate on push; or use a local YAML check).
- `docs/repo-management/DEPENDABOT.md` exists, describes the config and schedule, and links to GITHUB-LABELS.
- Labels `dependencies` and `docker` are defined (plan 10 / `scripts/github/setup-all-labels.sh`).

## Dependencies

- **Plan 10** (Git labels): Labels `dependencies` and `docker` must exist so Dependabot can apply them. Run after plan 10. Can run after plan 28 (repo setup doc) or in the same phase; no hard dependency on 28.
