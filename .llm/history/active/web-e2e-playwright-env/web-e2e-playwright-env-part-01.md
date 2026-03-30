# web-e2e-playwright-env

Started: 2026-03-24
Author: LLM session
Context: Self-contained Playwright web E2E server env (API CORS, sidecar API_SERVER_BASE_URL, shared module).

### Session 1 - 2026-03-24

#### Prompt (Developer)

Fix Boilerplate web E2E failures (Playwright env)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added `apps/web/playwright.e2e-server-env.ts` with `buildE2eWebApiEnvPrefix`, `buildE2eWebSidecarEnvPrefix`, and `buildE2eWebAppEnvPrefix` for three auth modes; API uses `TEST_JWT_SECRET_API`, explicit `API_CORS_ORIGINS=http://localhost:4012`, and sidecar sets `API_SERVER_BASE_URL=http://127.0.0.1:4010` plus all keys required by the web sidecar validator.
- Refactored all three web Playwright configs to compose `webServer` commands from those builders (fixes admin-only-email `WEB_SIDECAR_PORT` vs `PORT` typo).
- Documented self-contained env and CORS/SSR failure modes in `docs/testing/E2E-PAGE-TESTING.md`.
- Extended `apps/web/tsconfig.json` include for Playwright and the shared env module.

#### Files Created/Modified

- apps/web/playwright.e2e-server-env.ts
- apps/web/playwright.config.ts
- apps/web/playwright.signup-enabled.config.ts
- apps/web/playwright.admin-only-email.config.ts
- apps/web/tsconfig.json
- docs/testing/E2E-PAGE-TESTING.md
- .llm/history/active/web-e2e-playwright-env/web-e2e-playwright-env-part-01.md
