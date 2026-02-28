# 01 – Generate-data package, documentation, and sync skill

## Scope

Implement the `tools/generate-data` package (CLI, main/management seeders), add directory documentation per repo conventions, and add a project skill so future changes to the database schema result in updated seed logic.

**Key files:**

- Root [package.json](package.json) – add `tools/generate-data` to workspaces
- [infra/database/combined/init_database.sql](infra/database/combined/init_database.sql) – main schema reference
- [infra/management-database/combined/init_management_database.sql](infra/management-database/combined/init_management_database.sql) – management schema reference
- [packages/orm](packages/orm), [packages/management-orm](packages/management-orm) – entities to align seeders with

---

## Part A: Package layout and CLI

### 1. Workspace and package structure

- Add `"tools/generate-data"` to the root `package.json` `workspaces` array.
- Create `tools/generate-data/` with:
  - `package.json` – name `@boilerplate/generate-data`, type module, deps: `@boilerplate/orm`, `@boilerplate/management-orm`, `@boilerplate/helpers`, `@faker-js/faker`, `bcrypt`, `dotenv`; devDeps: TypeScript, `@types/node`, `@types/bcrypt` (if needed). Scripts: `build`, `generate` (node dist/cli.js).
  - `tsconfig.json` – extend or align with other packages (e.g. orm), output `dist/`.
  - `src/cli.ts` – parse target (`main` | `management` | `both`) and `--rows` / `-n` (default 100); resolve repo root; load env; call seeders; initialize/close DataSources.
  - `src/main/seed.ts` – use `appDataSource` from `@boilerplate/orm`; create N users + user_credentials + user_bio (faker email/displayName, bcrypt fixed test password).
  - `src/management/seed.ts` – use `managementDataSource` from `@boilerplate/management-orm`; create N management_user (is_super_admin false) + credentials + bio + admin_permissions (valid crud 0–15, event_visibility enum).

Env loading: load `apps/api/.env` for main/both and `apps/management-api/.env` for management/both **before** importing ORM packages (so `process.env` is set). Use repo root from `import.meta.url` (e.g. `path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')` from `src/cli.ts` → two levels up from `tools/generate-data/src` = repo root).

### 2. Seeding details

- **Main**: For each of N rows – User (profileVisibility, emailVerifiedAt nullable), UserCredentials (unique email via faker), UserBio (displayName; respect SHORT_TEXT_MAX_LENGTH). Use a single bcrypt-hashed password (e.g. `Password123!`) for all so test logins work.
- **Management**: For each of N rows – ManagementUser (is_super_admin false, created_by null), ManagementUserCredentials, ManagementUserBio, AdminPermissions (admins_crud/users_crud 0–15, event_visibility in 'own'|'all_admins'|'all'). Same fixed test password.
- Use `@faker-js/faker` (maintained fork of legacy `faker`). Optional: seed faker for reproducible runs.

---

## Part B: Documentation

Per the **documentation-conventions** skill: the repo has one README at root; directory-specific docs use the pattern `[FULL-PATH-WITH-HYPHENS].md`. For `tools/generate-data/` the doc name is **TOOLS-GENERATE-DATA.md** in that directory.

### Create `tools/generate-data/TOOLS-GENERATE-DATA.md`

Include:

- **Purpose** – Populate main and/or management DB with configurable faker-generated test data for local/dev.
- **Prerequisites** – DBs running, env set (apps/api and apps/management-api .env); run `npm run build:packages` first.
- **Commands** (from repo root):
  - `./scripts/nix/with-env npm run generate -w tools/generate-data -- main [--rows N]`
  - `./scripts/nix/with-env npm run generate -w tools/generate-data -- management [--rows N]`
  - `./scripts/nix/with-env npm run generate -w tools/generate-data -- both [--rows N]`
  Default rows: 100.
- **Env** – Main: DB_HOST, DB_PORT, DB_NAME, DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD (from apps/api/.env). Management: MANAGEMENT_DB_* (from apps/management-api/.env).
- **What gets seeded** – Main: user, user_credentials, user_bio per row. Management: management_user, management_user_credentials, management_user_bio, admin_permissions per row. All seeded users share a fixed test password (document it in the doc).
- **Keeping in sync** – When new tables or entities are added to main or management DB, update the seeders and this doc; use the **generate-data-sync** skill.

---

## Part C: Generate-data-sync skill

Create a **project skill** so the agent keeps the generate-data package in sync when schema or entities change.

### Create `.cursor/skills/generate-data-sync/SKILL.md`

**Purpose:** When new tables/entities are added to the main or management database (new migrations, new entities in `@boilerplate/orm` or `@boilerplate/management-orm`), update the generate-data package to seed those entities and update the tool docs.

**Suggested content:**

- **Frontmatter:**  
  `name: generate-data-sync`  
  `description: Keeps tools/generate-data seeders and docs in sync when main or management DB schema or ORM entities change. Use when adding or changing tables/entities in packages/orm, packages/management-orm, or infra database migrations.`

- **When to use:** Adding or changing tables in `infra/database/` or `infra/management-database/`; adding or changing entities in `packages/orm` or `packages/management-orm`.

- **Steps:**
  1. Identify new or changed tables/entities that should have seed data (e.g. core domain entities; skip internal tokens/refresh tokens if not needed for tests).
  2. In `tools/generate-data/src/main/seed.ts` or `src/management/seed.ts`: add or update seed logic for the new entity; respect FK order and constraints; use `@faker-js/faker` for appropriate fields; use bcrypt for password hashes where applicable.
  3. Update `tools/generate-data/TOOLS-GENERATE-DATA.md` to list the new seeded tables/entities.
  4. Follow **database-schema-naming** (snake_case columns, singular table names; entity `name` mapping).

- **References:**  
  - Main schema: `infra/database/combined/init_database.sql`  
  - Management schema: `infra/management-database/combined/init_management_database.sql`  
  - Seeders: `tools/generate-data/src/main/seed.ts`, `tools/generate-data/src/management/seed.ts`

---

## Verification

- From repo root: `./scripts/nix/with-env npm run build:packages` then `./scripts/nix/with-env npm run generate -w tools/generate-data -- main --rows 5` (and same for management, then both). Confirm rows in DB.
- Doc exists at `tools/generate-data/TOOLS-GENERATE-DATA.md` and matches documentation-conventions.
- Skill exists at `.cursor/skills/generate-data-sync/SKILL.md` with description and steps above.
