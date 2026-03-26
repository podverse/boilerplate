# Local env overrides plan implementation

Started: 2026-03-16
Context: Boilerplate env vars audit and move customizable to .config (local-env-overrides). Plan: keep WEB_BASE_URL, CORS_ORIGINS, WEB_APP_URL, MANAGEMENT_CORS_ORIGINS as local dev defaults; add mailer, auth, locale overrides with sensible defaults where applicable; no SMTP defaults.

---

### Session 1 - 2026-03-16

#### Prompt (Developer)

Boilerplate: Env vars audit and move customizable to .config (local-env-overrides). Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Bootstrap override .env from .env.example in setup.sh when missing so `make local_env_setup` applies sensible defaults (locale, auth) without requiring prepare/link first.
- No urls.env or cors.env; APP_BASE_URL, CORS_ORIGINS, WEB_APP_URL, MANAGEMENT_CORS_ORIGINS remain only in app .env.example as local dev defaults.
- mailer.env.example has empty placeholders only; auth.env.example and locale.env.example have sensible defaults so setup applies them automatically.
- brand.env.example expanded with NEXT_PUBLIC_APP_TITLE_ICON; setup applies to web and management-web when set.
- Locale applied to all four app/infra env files (management-api gets keys via upsert even though its .env.example doesn’t document them).

#### Files Created/Modified

- dev/env-overrides/local/mailer.env.example (new)
- dev/env-overrides/local/auth.env.example (new)
- dev/env-overrides/local/locale.env.example (new)
- dev/env-overrides/local/brand.env.example (expand NEXT_PUBLIC_APP_TITLE_ICON)
- scripts/local-env/setup.sh (bootstrap + apply mailer, auth, locale, brand icon)
- apps/api/.env.example (comments for locale, auth, mailer)
- apps/web/.env.example (comments for locale, brand icon)
- apps/management-api/.env.example (comment for auth)
- apps/management-web/.env.example (comments for locale, brand icon)
- docs/development/LOCAL-ENV-OVERRIDES.md (table + intro)
- AGENTS.md (Local env section)
- .cursor/skills/env-templates/SKILL.md (override list)
- dev/env-overrides/local/.gitkeep (override list)

### Session 2 - 2026-03-19

#### Prompt (Developer)

it seems like in boilerplate, when i run local_env_clean it is NOT deleting all the local env files. i still see all of them in boilerplate/infra/config/local/

#### Key Decisions

- `local_env_clean` used paths relative to current directory; when `make` was run from a subdirectory (e.g. `apps/web`), the `rm` ran in the wrong place and left `infra/config/local/*.env` untouched.
- Root Makefile now sets `ROOT := $(dir $(abspath $(firstword $(MAKEFILE_LIST))))` so env clean always targets repo root.
- Clean recipe uses `$(ROOT)infra/config/local/*.env` and explicit app paths so it works from any directory; `infra/config/local` uses a wildcard so any new .env there is removed without updating the Makefile.

#### Files Created/Modified

- Makefile (ROOT variable)
- makefiles/local/Makefile.local.env.mk (local_env_clean uses ROOT; wildcard for infra/config/local)
- docs/development/LOCAL-ENV-OVERRIDES.md (doc that clean uses repo root and works from any dir)
