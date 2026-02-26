# Plan 12: Add ORM package

## Scope

Add `packages/orm`: TypeORM (or minimal equivalent), entity for User (and optionally
message-related if any stored in Postgres). Depends on `@boilerplate/helpers` and Postgres
config. Use **read-only and read-write** DB users (same pattern as Podverse): API connects
with read-write by default; read-only is available for future read-heavy paths. Init DB schema from numbered migrations combined into `infra/database/combined/init_database.sql`
(see Migrations layout below). Used by auth (plan 15).

## Steps

1. **Create package**
   - `packages/orm/package.json`: name `@boilerplate/orm`, dependencies typeorm, pg,
     @boilerplate/helpers; devDependencies @types/node, typescript. Scripts: build, lint, clean,
     type-check. Add to root workspaces.

2. **DataSource config (read-write and read-only)**
   - Read Postgres connection from env. **Required env vars** (validated at app startup, e.g. in
     api validation): DB_HOST, DB_PORT, DB_NAME; **DB_READ_USERNAME**, **DB_READ_PASSWORD**;
     **DB_READ_WRITE_USERNAME**, **DB_READ_WRITE_PASSWORD**.
   - Export a DataSource (or config factory) that uses the **read-write** credentials for
     normal use (DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD). Optionally export or
     document a separate read-only DataSource/config for future use (DB_READ_USERNAME,
     DB_READ_PASSWORD). If supporting DATABASE_URL, it should use the read-write URL.
   - Document that plan 03 creates the `read` and `read_write` roles; apps must set all four
     DB_READ_* and DB_READ_WRITE_* vars.

3. **User entity**
   - Entity User: id (PK), email (unique), password hash, createdAt; **required** field
     profileVisibility (or messagesPublic) for "viewable by anyone" (plan 22); optional
     displayName. Use TypeORM decorators; table name e.g. `users`.

4. **Schema: numbered migrations + combine script (same pattern as Podverse)**
   - **Migrations** live in `infra/database/migrations/` as numbered files, e.g.:
     - `0000_init_helpers.sql` – extensions, minimal helper domains (varchar_email, varchar_password,
       varchar_short, server_time_with_default), `set_updated_at_field()` trigger function.
     - `0001_users.sql` – users table (id UUID PK, email, password, display_name, profile_visibility,
       created_at, updated_at) and set_updated_at trigger.
   - **init_database.sql** is **generated** by `scripts/database/combine-migrations.sh`; do not edit
     it by hand. After adding or changing a migration file, run the script to regenerate
     `infra/database/combined/init_database.sql`.
   - ORM only connects; no TypeORM migrations. Plan 03 ensures 01_create_users.sh runs first so
     read/read_write get default privileges on tables. A future plan can add 0002_api_keys.sql
     (plan 15 designs auth for revocable API keys).
   - Document in README that schema is in migrations/ and init_database.sql is combined output.

5. **Export**
   - Export DataSource (or getDataSource), User entity, and any repositories or services
     (e.g. UserRepository or UserService with findById, findByEmail, create). Keep API
     minimal for boilerplate.

6. **API integration and validation**
   - Apps (e.g. api) add dependency on @boilerplate/orm; use DataSource and User in auth routes
     (plan 15). API startup validation (e.g. in apps/api or via @boilerplate/helpers) must
     require DB_READ_USERNAME, DB_READ_PASSWORD, DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD
     when the app uses the database. Do not implement auth in this plan; only provide ORM layer.

## Key files

- `packages/orm/package.json`
- `packages/orm/src/data-source.ts` (or config.ts) – use read-write env
- `packages/orm/src/entities/User.ts`
- `packages/orm/src/index.ts`
- `packages/orm/tsconfig.json`
- `infra/database/migrations/*.sql` (numbered; combine script outputs init_database.sql)
- Root package.json workspaces
- App startup validation (DB_READ_*, DB_READ_WRITE_* required)

## Verification

- `npm run build` builds packages/helpers then packages/orm.
- With Postgres running and all DB_READ_* and DB_READ_WRITE_* env vars set, app can import
  DataSource and User and connect; users table exists and is accessible with read_write user.
