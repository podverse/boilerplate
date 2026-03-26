# @boilerplate/orm

TypeORM package for Boilerplate: DataSource (read-write), User entity, UserService.

- **Schema** is in numbered migrations under `infra/database/migrations/`. Run
  `scripts/database/combine-migrations.sh` to regenerate
  `infra/database/combined/init_database.sql` (do not edit that file by hand).
- **Connection** uses read-write credentials (`DB_APP_READ_WRITE_USER`,
  `DB_APP_READ_WRITE_PASSWORD`). Apps must validate `DB_HOST`, `DB_PORT`, `DB_APP_NAME`,
  `DB_APP_READ_*`, and `DB_APP_READ_WRITE_*` at startup.

Build: `npm run build` (from repo root, build packages first).
