# Boilerplate

HTTP API and Next.js app. Structure and tooling mirror the Podverse monorepo where applicable.

## Structure

- **apps/api** – Standalone Express API (port 4000 by default)
- **apps/web** – Next.js app (port 4100 by default)
- **apps/web/sidecar** – Runtime-config server for the web app (port 4101 when used)

## Setup

**Quick path (clone → running):** See [docs/QUICK-START.md](docs/QUICK-START.md) (Make + Docker for Postgres/Valkey, API and web on host).

**With Nix (Linux / macOS):** If you use [direnv](https://direnv.net/), run `direnv allow` in the repo root once. The flake provides Node 24 and the shell loads automatically. Without direnv: `nix develop` to enter the dev shell.

```bash
npm install
```

## Run

**API only:**

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env: API_PORT, APP_NAME
npm run dev:api
```

**Web only (no sidecar):**

```bash
npm run dev:web
```

**Web with sidecar (runtime config from env):**

```bash
cp apps/web/.env.example apps/web/.env.local
# Set RUNTIME_CONFIG_URL=http://localhost:4101, NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_API_URL
npm run dev:web-sidecar
```

This builds the sidecar, then starts the sidecar (port 4101) and the Next.js app. The app loads config from the sidecar at startup.

## Env examples

- **API**: `API_PORT`, `APP_NAME`, `JWT_SECRET`, and optionally `AUTH_MODE`, `MAILER_ENABLED` (see `apps/api/.env.example`)
- **Web**: `RUNTIME_CONFIG_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_API_URL` (see `apps/web/.env.example`)

## API auth

The API uses JWT: send `Authorization: Bearer <token>` for protected routes (e.g. `GET /auth/me`, `POST /auth/change-password`). Set `MAILER_ENABLED=true` for self-service signup (`POST /auth/signup`). When mailer is disabled (default or `AUTH_MODE=admin_only`), signup is disabled; user creation is handled by the Management API when the Management track (plans 31–33) is in use.

**JWT_SECRET** must be at least 32 characters and not weak. Generate one with:

```bash
openssl rand -base64 32
# or: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Put the output in `apps/api/.env` as `JWT_SECRET="<paste-here>"`.

## Gitflow and CI

Default branch is **develop**; open PRs against `develop`. Use `npm run start-feature` to create branches (e.g. `feature/name`, `fix/name`). CI runs when a PR targets develop (on open/update) and when a maintainer comments **/test** on a PR. See [docs/GITFLOW.md](docs/GITFLOW.md).

## Scripts

- `npm run build` – Build all workspaces
- `npm run dev:api` – API only (port 4000)
- `npm run dev:web` – Web only (port 4100)
- `npm run dev:web-sidecar` – Build sidecar, then run sidecar (port 4101)
- `npm run dev:all` – Build sidecar, then run API, sidecar, and web together
- `npm run dev:api:watch` – API with auto-rebuild on change (tsc --watch + nodemon)
- `npm run dev:web:watch` – Web (Next.js dev; already hot-reloads)
- `npm run dev:all:watch` – API, sidecar, and web with auto-rebuild on change
- `npm run lint` – ESLint + Prettier check (TS/JS, YAML, JSON, MD, etc.)
- `npm run lint:fix` – ESLint --fix + Prettier --write (fixes all supported files, including docker-compose)
- `npm run prettier:check` / `npm run prettier:write` – Prettier only

**Version bump:** Run `./scripts/publish/bump-version.sh` when cutting a release. It updates root and all workspace `package.json` versions, then commits and pushes (no npm publish or image push).

**Alpha publish:** Merging to the `alpha` branch runs the Publish Alpha workflow and pushes Docker images (api, web, web-sidecar) to GHCR. See [docs/PUBLISH.md](docs/PUBLISH.md).

**GitHub labels:** Run `./scripts/github/setup-all-labels.sh` to create or update repo labels (requires `gh auth login`). See [scripts/github/SCRIPTS-GITHUB.md](scripts/github/SCRIPTS-GITHUB.md) and [docs/repo-management/GITHUB-LABELS.md](docs/repo-management/GITHUB-LABELS.md). For one-time repo setup (labels, branch protection, default branch), see [docs/repo-management/GITHUB-SETUP.md](docs/repo-management/GITHUB-SETUP.md).

## LLM / Cursor

See [.llm/LLM.md](.llm/LLM.md) and [AGENTS.md](AGENTS.md) for history tracking and agent guidelines.
