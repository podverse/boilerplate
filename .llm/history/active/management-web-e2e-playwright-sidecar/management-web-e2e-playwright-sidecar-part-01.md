# management-web-e2e-playwright-sidecar

Started: 2026-03-24
Author: LLM session
Context: Management-web Playwright E2E starts runtime sidecar (4111) and sets RUNTIME_CONFIG_URL; shared env module; CORS for 4112.

### Session 1 - 2026-03-24

#### Prompt (Developer)

apply

#### Key Decisions

- Added `apps/management-web/playwright.e2e-server-env.ts` with `buildE2eManagementWebSidecarEnvPrefix` and `buildE2eManagementWebAppEnvPrefix` (ports 4110 / 4111 / 4112; `NEXT_PUBLIC_WEB_BASE_URL` aligned with web E2E at `http://localhost:4012`).
- Updated `apps/management-web/playwright.config.ts` to start three webServers: management-api, `npm run build` for `@boilerplate/management-web-sidecar` then `dev:sidecar`, then management-web `build`/`start` with `RUNTIME_CONFIG_URL=http://localhost:4111`.
- Set `MANAGEMENT_API_CORS_ORIGINS=http://localhost:4112` on the Playwright management-api env for credentialed browser requests from the E2E origin.
- Extended `apps/management-web/tsconfig.json` include for Playwright and the env module.
- Documented management-web E2E ports and self-contained env in `docs/testing/E2E-PAGE-TESTING.md`; Makefile E2E comment updated for 4111.

#### Files Created/Modified

- apps/management-web/playwright.e2e-server-env.ts
- apps/management-web/playwright.config.ts
- apps/management-web/tsconfig.json
- docs/testing/E2E-PAGE-TESTING.md
- makefiles/local/Makefile.local.e2e.mk
- .llm/history/active/management-web-e2e-playwright-sidecar/management-web-e2e-playwright-sidecar-part-01.md

### Session 2 - 2026-03-25

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/10.txt:8-1063 debug the error. the first 3 e2e suites succeeded, but last one failed

#### Key Decisions

- Management-web E2E failed because **`dev:sidecar`** runs startup validation: **`NEXT_PUBLIC_MANAGEMENT_API_PUBLIC_BASE_URL`** is checked with **`validateHttpOrHttpsUrl`** in `apps/management-web/sidecar/src/server.ts`. The value **`/api/management`** is not a valid URL, so the sidecar exited before Playwright could start management-web.
- Set E2E **`NEXT_PUBLIC_MANAGEMENT_API_PUBLIC_BASE_URL=http://localhost:4110`** (matches `infra/env/classification` pattern: full management API origin). Browser requests go cross-origin to port 4110; **`MANAGEMENT_API_CORS_ORIGINS=http://localhost:4112`** already allows the management-web E2E origin.
- Documented the http(s) requirement in `docs/testing/E2E-PAGE-TESTING.md`.

#### Files Created/Modified

- apps/management-web/playwright.e2e-server-env.ts
- docs/testing/E2E-PAGE-TESTING.md
- .llm/history/active/management-web-e2e-playwright-sidecar/management-web-e2e-playwright-sidecar-part-01.md
