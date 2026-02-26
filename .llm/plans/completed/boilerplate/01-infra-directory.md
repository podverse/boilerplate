# Plan 01: Infra directory

## Scope

Add an `infra/` directory layout aligned with the podverse monorepo: config, database, and docker
subdirs. No k8s. Env templates live under `infra/config/env-templates/`; optional
`infra/config/local/` for local overrides.

## Steps

1. **Create directory structure**
   - `infra/config/env-templates/` – Template env files (e.g. api.env.example, web.env.example)
     that point to or mirror app `.env.example` content.
   - `infra/config/local/` – Optional; add to `.gitignore` so local overrides are not committed.
   - `infra/database/` – Placeholder for init scripts (used in plan 03). Add a `.gitkeep`
     file so the directory is committed before plan 03 creates content.
   - `infra/docker/` – Placeholder for Dockerfiles and compose (used in plan 02). Add a
     `.gitkeep` so the directory is committed before plan 02 creates content.

2. **Env templates**
   - Add `infra/config/env-templates/api.env.example`: minimal stub (e.g. API_PORT, APP_NAME)
     or a short comment that the canonical template is `apps/api/.env.example`.
   - Add `infra/config/env-templates/web.env.example`: same idea for web (e.g.
     RUNTIME_CONFIG_URL, NEXT_PUBLIC_*). Keep templates short; link to app-level docs.

3. **Documentation**
   - Add a short `infra/README.md` (or section in root README) describing: config layout,
     that `local/` is for local overrides and gitignored, and that database/docker are
     used by later setup.

4. **.gitignore**
   - Add exactly one line to root `.gitignore`: `infra/config/local/` so that any file
     under that directory is ignored and local env overrides are never committed.

## Key files

- `infra/config/env-templates/api.env.example`
- `infra/config/env-templates/web.env.example`
- `infra/config/local/` (directory, gitignored)
- `infra/database/.gitkeep`
- `infra/docker/.gitkeep`
- `infra/README.md` (optional)
- `.gitignore` (update)

## Verification

- Directories exist: `infra/config/env-templates`, `infra/config/local`, `infra/database`,
  `infra/docker`.
- Env template files exist and are valid (no syntax errors).
- `git check-ignore infra/config/local/foo.env` (or similar) confirms local is ignored.
