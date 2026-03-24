---
name: env-templates-pointer
description: Env-templates for app envs must only point to the app .env.example; do not duplicate. Use when adding or changing infra/config/env-templates or app .env.example files.
---

# Env templates: single source of truth

## Rule

**`infra/config/env-templates/`** files for **app** env (api, web, management-api, management-web) must **not** duplicate the app’s env. They must only contain a short comment that points to the canonical source.

- **Canonical source**: `apps/<app>/.env.example` (e.g. `apps/api/.env.example`, `apps/web/.env.example`). For **web** and **management-web**, the app `.env.example` contains only `RUNTIME_CONFIG_URL`; the full variable list is in `apps/web/sidecar/.env.example` and `apps/management-web/sidecar/.env.example`.
- **Stub file**: `infra/config/env-templates/<app>.env.example` contains only a comment pointing to that path and how to copy (e.g. `make local_env_setup` or `cp apps/api/.env.example infra/config/local/api.env`).

## Local env (Boilerplate)

Secrets (JWT, DB, Valkey, etc.) are **auto-generated** by `make local_env_setup` via
`scripts/env-setup-secrets.sh`. Override files (from `dev/env-overrides/examples/*.env.example`, copied to `~/.config/...` and linked as `dev/env-overrides/local/*.env`) are
applied when present: **management-superuser.env** → db.env; **brand.env** → API, web, management-api,
management-web (BRAND_NAME, NEXT_PUBLIC_BRAND_NAME, NEXT_PUBLIC_APP_TITLE_ICON); **mailer.env** → API
(no defaults; devs bring their own); **auth.env** → API, management-api; **locale.env** → all four apps
(sensible defaults). APP_BASE_URL, CORS_ORIGINS, WEB_APP_URL, MANAGEMENT_CORS_ORIGINS stay as local dev
defaults (not in overrides). Generated files: `infra/config/local/*.env` and app `.env`/`.env.local`
are produced by `local_env_setup` from templates, generated secrets, and overrides. See
[docs/development/LOCAL-ENV-OVERRIDES.md](../../docs/development/LOCAL-ENV-OVERRIDES.md).

## Rationale

One source of truth per app. Add or change variables only in the app’s `.env.example`; `make local_env_setup` (or `make env_setup`) copies from the app into `infra/config/local/` for Docker and fills secrets via env-setup-secrets.sh. No syncing two full files.

## Non-app templates

- **db.env.example**, **valkey.env.example**: Stay in `env-templates/` with full content (they are infra-only, not owned by an app).
- **api.env.example**, **web.env.example**, and later **management-api.env.example**, **management-web.env.example**: Stub + pointer only.

## When adding management-api or management-web

1. Add `apps/management-api/.env.example` with full variables. For **management-web** (and **web**), the app `.env.example` contains only `RUNTIME_CONFIG_URL`; add the full list to the corresponding sidecar `.env.example` in `apps/web/sidecar/` or `apps/management-web/sidecar/` instead.
2. Add `infra/config/env-templates/management-api.env.example` (or `management-web.env.example`) with only a comment pointing to that app’s `.env.example`.
3. In `local_env_setup` (scripts/local-env/setup.sh), copy from the app’s `.env.example` to `infra/config/local/management-api.env` (or `management-web.env`).
