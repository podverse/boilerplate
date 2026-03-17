# Align all Boilerplate secret auto-generation with Podverse

**Goal:** Make Boilerplate use the same secret auto-generation approach as Podverse for **all** secrets (DB, Valkey, JWT), not just JWT: hex for passwords, UUID for JWT, `first_non_empty_or_generate` to reuse existing values, logic in setup.sh.

## Comparison (all secrets)

| Secret type | Podverse | Boilerplate today |
|-------------|----------|-------------------|
| Postgres / DB passwords | `generate_hex_32` + `first_non_empty_or_generate` (+ optional `generate_if_empty_or_placeholder`) | `generate_secret` (base64) in env-setup-secrets.sh |
| Valkey/Redis password | `generate_hex_32` + same reuse pattern | `generate_secret` (base64) |
| JWT (API + management) | `generate_uuid` + `first_non_empty_or_generate` across both app env files; one value for both | base64, separate JWT_SECRET and MANAGEMENT_JWT_SECRET |

Podverse uses **hex** for all passwords (shell-safe). **UUID** for JWT (36 chars, no special chars). Boilerplate uses one base64 generator for everything.

## Podverse helpers to add in Boilerplate setup.sh

- **first_non_empty_or_generate** — for each `file:var` try `get_var`; if any non-empty return it; else run generator.
- **generate_hex_32** — `openssl rand -hex 32` or `node -e "require('crypto').randomBytes(32).toString('hex')"`.
- **generate_uuid** — `uuidgen` (lowercase) or `node -e "require('crypto').randomUUID()"`.
- **generate_if_empty_or_placeholder** (optional) — if value empty or equals a placeholder string, generate; else return value.

Reference: [podverse/scripts/local-env/setup.sh](https://github.com/podverse/podverse/blob/main/scripts/local-env/setup.sh) lines 105–179, 229–246, 248–293.

## Implementation steps

### 1. Add helpers to Boilerplate setup.sh

In **scripts/local-env/setup.sh**, after `get_var` / `upsert_var`:

- Add `first_non_empty_or_generate` (generator name + `file:var` pairs).
- Add `generate_hex_32`.
- Add `generate_uuid`.
- Optionally `generate_base64_32` and `generate_if_empty_or_placeholder` if templates have placeholders to replace.

### 2. Generate all secrets in setup.sh before env-setup-secrets.sh

Before `bash scripts/env-setup-secrets.sh`:

- **POSTGRES_PASSWORD** = `first_non_empty_or_generate generate_hex_32 "$DB_ENV:POSTGRES_PASSWORD"`.
- **DB_READ_PASSWORD** = `first_non_empty_or_generate generate_hex_32 "$DB_ENV:DB_READ_PASSWORD"`.
- **DB_READ_WRITE_PASSWORD** = `first_non_empty_or_generate generate_hex_32 "$DB_ENV:DB_READ_WRITE_PASSWORD"`.
- **VALKEY_PASSWORD** = `first_non_empty_or_generate generate_hex_32 "$VALKEY_ENV:VALKEY_PASSWORD"` (and optionally from API env files for reuse).
- **JWT_SECRET** (one value for both apps) = `first_non_empty_or_generate generate_uuid "$API_INFRA_ENV:JWT_SECRET" "$API_APP_ENV:JWT_SECRET" "$MANAGEMENT_API_INFRA_ENV:MANAGEMENT_JWT_SECRET" "$MANAGEMENT_API_APP_ENV:MANAGEMENT_JWT_SECRET"`.

Then **upsert_var**:

- db.env: POSTGRES_PASSWORD, DB_READ_PASSWORD, DB_READ_WRITE_PASSWORD.
- valkey.env: VALKEY_PASSWORD.
- API app + API infra: JWT_SECRET, DB_READ_PASSWORD, DB_READ_WRITE_PASSWORD, VALKEY_PASSWORD.
- Management-api app + infra: MANAGEMENT_JWT_SECRET (= same as JWT_SECRET), DB credentials, MANAGEMENT_DB_PASSWORD as needed.

### 3. Slim env-setup-secrets.sh

In **scripts/env-setup-secrets.sh**:

- Remove all secret generation (no `generate_secret`, no variables for POSTGRES, DB_READ_*, VALKEY, JWT, MANAGEMENT_JWT).
- Remove all `set_var_if_empty` for those secrets.
- Keep only the blocks that set **host connection defaults** in app .env (DB_HOST=localhost, DB_PORT=5433, VALKEY_HOST, VALKEY_PORT for API; and management-api .env host/port/DB name defaults).

### 4. E2E Playwright: shell-safe MANAGEMENT_JWT_SECRET

The test constant contains `!`, `#`, `$`, `&`, `%`, `@`; when interpolated into the webServer command the shell breaks. Fix by quoting the value in **apps/management-web/playwright.config.ts** when building the env string (e.g. single-quote the value so it is one shell token).

### 5. Docs

Update **docs/development/LOCAL-ENV-OVERRIDES.md** to state that all secrets are auto-generated in setup.sh using the same approach as Podverse (hex for passwords, UUID for JWT, first_non_empty_or_generate to reuse).

## File list

- **scripts/local-env/setup.sh** — add helpers; add secret generation + upsert block before env-setup-secrets.sh.
- **scripts/env-setup-secrets.sh** — remove secret generation and assignment; keep host-defaults only.
- **apps/management-web/playwright.config.ts** — quote MANAGEMENT_JWT_SECRET in webServer command.
- **docs/development/LOCAL-ENV-OVERRIDES.md** — document aligned secret generation.
