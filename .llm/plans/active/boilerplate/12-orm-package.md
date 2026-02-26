# Plan 12: Add ORM package

## Scope

Add `packages/orm`: TypeORM (or minimal equivalent), entity for User (and optionally
message-related if any stored in Postgres). Depends on `@boilerplate/helpers` and Postgres
config. Init DB schema from `infra/database/` or via ORM migrations. Used by auth (plan 15).

## Steps

1. **Create package**
   - `packages/orm/package.json`: name `@boilerplate/orm`, dependencies typeorm, pg,
     @boilerplate/helpers; devDependencies @types/node, typescript. Scripts: build, lint, clean,
     type-check. Add to root workspaces.

2. **DataSource config**
   - Read Postgres connection from env (DATABASE_URL or DB_HOST, DB_PORT, DB_NAME, DB_USER,
     DB_PASSWORD). Export a DataSource (or config factory) that apps can use to initialize
     TypeORM.

3. **User entity**
   - Entity User: id (PK), email (unique), password hash, createdAt; **required** field
     profileVisibility (or messagesPublic) for "viewable by anyone" (plan 22); optional
     displayName. Use TypeORM decorators; table name e.g. `users`.

4. **Schema: init script (Option A – chosen)**
   - Use the init script in `infra/database/combined/init_database.sql` to create the users
     table (and any other tables). ORM only connects; no TypeORM migrations. In plan 03 the
     init script can stay minimal; in this plan add the SQL for the users table to the init
     script. A future plan can add an api_keys table for revocable API keys (plan 15
     designs auth so this is possible).
   - Document in README that schema is managed via init script only.

5. **Export**
   - Export DataSource (or getDataSource), User entity, and any repositories or services
     (e.g. UserRepository or UserService with findById, findByEmail, create). Keep API
     minimal for boilerplate.

6. **API integration**
   - Apps (e.g. api) add dependency on @boilerplate/orm; use DataSource and User in auth routes
     (plan 15). Do not implement auth in this plan; only provide ORM layer.

## Key files

- `packages/orm/package.json`
- `packages/orm/src/data-source.ts` (or config.ts)
- `packages/orm/src/entities/User.ts`
- `packages/orm/src/index.ts`
- `packages/orm/tsconfig.json`
- Optional: `packages/orm/src/migrations/` and migration runner
- `infra/database/combined/init_database.sql` (if using init script for schema)
- Root package.json workspaces

## Verification

- `npm run build` builds packages/helpers then packages/orm.
- With Postgres running and env set, app can import DataSource and User and connect; users
  table exists (created by init script or migration).
