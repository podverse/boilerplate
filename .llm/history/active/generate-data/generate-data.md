# generate-data tool

**Started:** 2026-02-28  
**Context:** Implement generate-data CLI package per plan (tools directory, main/management seeders, docs, skill).

---

### Session 1 - 2026-02-28

#### Prompt (Developer)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
To-do's from the plan have already been created. Do not create them again. Mark them as in_progress
as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Repo root from `dist/cli.js`: `path.resolve(__dirname, '..', '..')`.
- Env loaded in cli.ts before dynamic import of seed modules so DataSources see `process.env`.
- All seeded users share fixed test password `Password123!` (bcrypt); documented in TOOLS-GENERATE-DATA.md.
- Replaced `console.log` with `process.stdout.write` to satisfy no-console rule.
- Added `tools/generate-data` to root type-check; added lint/type-check scripts to package.

#### Files Created/Modified

- `package.json` – workspaces + type-check entry for generate-data
- `tools/generate-data/package.json` – new package, deps, scripts (build, generate, generate:main, etc.)
- `tools/generate-data/tsconfig.json` – new
- `tools/generate-data/src/cli.ts` – new
- `tools/generate-data/src/main/seed.ts` – new
- `tools/generate-data/src/management/seed.ts` – new
- `tools/generate-data/TOOLS-GENERATE-DATA.md` – new (per documentation-conventions)
- `.cursor/skills/generate-data-sync/SKILL.md` – new

### Session 2 - 2026-02-28

#### Prompt (Developer)

debug (terminal 21: generate-data both failing with QueryFailedError: Every user must have exactly one user_credentials row; create user and credentials in the same transaction.)

#### Key Decisions

- Added `SET CONSTRAINTS ALL DEFERRED` at the start of each main-seed transaction so the deferred constraint trigger sees user + user_credentials at commit.
- Rebuild required: `npm run build -w tools/generate-data` before `npm run generate` so dist has the change.

#### Files Created/Modified

- `tools/generate-data/src/main/seed.ts` – run SET CONSTRAINTS ALL DEFERRED inside transaction before creating user/credentials/bio
