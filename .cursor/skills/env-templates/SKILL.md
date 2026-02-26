---
name: env-templates-pointer
description: Env-templates for app envs must only point to the app .env.example; do not duplicate. Use when adding or changing infra/config/env-templates or app .env.example files.
---

# Env templates: single source of truth

## Rule

**`infra/config/env-templates/`** files for **app** env (api, web, management-api, management-web) must **not** duplicate the app’s env. They must only contain a short comment that points to the canonical source.

- **Canonical source**: `apps/<app>/.env.example` (e.g. `apps/api/.env.example`, `apps/web/.env.example`).
- **Stub file**: `infra/config/env-templates/<app>.env.example` contains only a comment pointing to that path and how to copy (e.g. `make env_setup` or `cp apps/api/.env.example infra/config/local/api.env`).

## Rationale

One source of truth per app. Add or change variables only in the app’s `.env.example`; `make env_setup` (or equivalent) copies from the app into `infra/config/local/` for Docker. No syncing two full files.

## Non-app templates

- **db.env.example**, **valkey.env.example**: Stay in `env-templates/` with full content (they are infra-only, not owned by an app).
- **api.env.example**, **web.env.example**, and later **management-api.env.example**, **management-web.env.example**: Stub + pointer only.

## When adding management-api or management-web

1. Add `apps/management-api/.env.example` (or `apps/management-web/.env.example`) with full variables.
2. Add `infra/config/env-templates/management-api.env.example` (or `management-web.env.example`) with only a comment pointing to that app’s `.env.example`.
3. In `env_setup` (or equivalent), copy from the app’s `.env.example` to `infra/config/local/management-api.env` (or `management-web.env`).
