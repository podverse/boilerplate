# @boilerplate/orm

TypeORM package for Boilerplate: DataSource (read-write), User entity, UserService.

- **Schema** is in numbered migrations under `infra/database/migrations/`. Run
  `scripts/database/combine-migrations.sh` to regenerate
  `infra/database/combined/init_database.sql` (do not edit that file by hand).
- **Connection** uses read-write credentials (`DB_READ_WRITE_USERNAME`,
  `DB_READ_WRITE_PASSWORD`). Apps must validate `DB_HOST`, `DB_PORT`, `DB_NAME`,
  `DB_READ_*`, and `DB_READ_WRITE_*` at startup.

Build: `npm run build` (from repo root, build packages first).
