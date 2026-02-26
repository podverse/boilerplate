# Boilerplate

HTTP API and Next.js app. Structure and tooling mirror the Podverse monorepo where applicable.

## Structure

- **apps/api** – Standalone Express API (port 4000 by default)
- **apps/web** – Next.js app (port 4100 by default)
- **apps/web/sidecar** – Runtime-config server for the web app (port 4101 when used)

## Setup

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

- **API**: `API_PORT`, `APP_NAME` (see `apps/api/.env.example`)
- **Web**: `RUNTIME_CONFIG_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_API_URL` (see `apps/web/.env.example`)

## Scripts

- `npm run build` – Build all workspaces
- `npm run dev:api` – API only (port 4000)
- `npm run dev:web` – Web only (port 4100)
- `npm run dev:web-sidecar` – Build sidecar, then run sidecar (port 4101)
- `npm run dev:all` – Build sidecar, then run API, sidecar, and web together
- `npm run dev:api:watch` – API with auto-rebuild on change (tsc --watch + nodemon)
- `npm run dev:web:watch` – Web (Next.js dev; already hot-reloads)
- `npm run dev:all:watch` – API, sidecar, and web with auto-rebuild on change
- `npm run lint` / `npm run lint:fix` – ESLint
- `npm run prettier:check` / `npm run prettier:write` – Prettier

## LLM / Cursor

See [.llm/LLM.md](.llm/LLM.md) and [AGENTS.md](AGENTS.md) for history tracking and agent guidelines.
