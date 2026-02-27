# AI Development Guide – Boilerplate

Quick reference for AI assistants working on the Boilerplate repo (HTTP API + Next.js app).

## Stack

- Node.js 24+ (see `.nvmrc`)
- npm workspaces: `apps/api`, `apps/web`, `apps/web/sidecar`
- TypeScript strict, ESM

## Commands

```bash
npm install
npm run build
npm run lint
npm run dev:api          # API only (default port 3000)
npm run dev:web          # Next.js only
npm run dev:web-sidecar  # Build sidecar + run web with sidecar
```

### Nix / terminal (agent sandbox)

Node and npm are provided by the repo's Nix flake, not a global install. When running terminal commands (e.g. in Cursor's agent), use the wrapper so the correct environment is available:

- **Wrapper:** `./scripts/nix/with-env <command> [args...]`
- **Examples:** `./scripts/nix/with-env npm run build`, `./scripts/nix/with-env npm run dev:api`
- Run from repo root. Full explanation and setup-in-other-repos: [docs/CURSOR-NIX-WITH-ENV.md](docs/CURSOR-NIX-WITH-ENV.md).
- Agent runs that use the wrapper may need full permissions so Nix can write to its cache.

## Structure

- `apps/api/` – Standalone Express HTTP API
- `apps/web/` – Next.js app (fetches runtime config from sidecar when `RUNTIME_CONFIG_URL` is set)
- `apps/web/sidecar/` – Runtime-config sidecar (serves env-derived config for the Next.js app)

## LLM History

See [.llm/LLM.md](.llm/LLM.md) for full guidelines. Use the **llm-history** skill when updating history or starting feature work.

- **Before file-modifying work:** If the current branch matches an existing `.llm/history/active/[feature]/` (e.g. branch `chore/first-test-issue` → `first-test-issue`), update that history file; no exception for small changes.

## Testing

- **API integration tests:** `npm run test` from repo root. The **first step** is a requirements check: Postgres
  and Valkey must be reachable at the test ports (defaults 5532, 6479). If not, the script exits with instructions
  (e.g. `make test_deps`). In Nix/agent environments use `./scripts/nix/with-env npm run test`.
- **Test requirements (Makefile):** Test-related commands live in `makefiles/local/Makefile.local.test.mk`. From
  repo root: `make test_deps` starts Postgres on 5532 and Valkey on 6479, creates **two** test databases:
  `boilerplate_test` (main app; `infra/database/combined/init_database.sql`) and `boilerplate_management_test`
  (management-api; `infra/management-database/combined/init_management_database.sql`), and creates read/read_write
  users. `make help_test` prints instructions.
- **Test databases:** Tests use dedicated DBs on the same Postgres instance. Main: `boilerplate_test` (api and
  management-api main-user CRUD). Management: `boilerplate_management_test` (management identities, permissions,
  events). Default test ports are **5532** (Postgres) and **6479** (Valkey). Each test run starts with a **clean slate**:
  globalSetup truncates main and management tables once before any test file runs (api: `apps/api/src/test/global-setup.mjs`;
  management-api: `apps/management-api/src/test/global-setup.mjs`).
- **Mailer:** No local mailer service is required. Tests that cover verification flows use a Vitest mock of the
  mailer module to capture tokens and call verification endpoints; see `apps/api/src/test/*.test.ts`.

## Auth and PII

- **Credentials:** The system stores only `passwordHash` (no plaintext password). Never return `passwordHash` or any credential field in API responses. Use `userToJson` (or a similar safe serializer) for user data; never serialize `req.user` or `user.credentials` directly.
- **Verification tokens:** Token hashes and raw tokens are never returned or listed by the API; they are only consumed server-side (verify-email, reset-password, confirm-email-change). Do not add endpoints that expose verification token entities.
- **User in responses:** The only allowed user shape in responses is `PublicUser` (id, email, displayName). Email is PII and is only returned to the authenticated user (login, me, signup).

## Code Quality

- Strict equality (`===` / `!==` only)
- Avoid type assertions (`as`); prefer types and narrowing
- Semicolons in JS/TS

## Skills and Rules

- **.cursor/skills/** – Project skills (llm-history, api, web, global, etc.)
- **.cursor/rules/** – Glob-triggered rules (eqeqeq, avoid-type-assertions, llm-history-tracking, etc.)

All configuration is project-scoped (no home-directory skills or rules).
