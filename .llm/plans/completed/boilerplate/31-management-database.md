# Plan 31: Management database

## Scope

Dedicated store for management identities, permissions, and **audit events**. No main-app
users are stored here. The management API uses this store for super admin, admins, their
permissions, and the events table; it uses the main app Postgres (plan 12) only for
main-system user CRUD.

## Database choice

- **Postgres only:** Second database (e.g. `management_db`) on the same server as the main
  app. Same engine and tooling as main; MANAGEMENT_DB_* env vars. Create the DB once, run
  `management-database/combined/init_management_database.sql` (generated from `management-database/migrations/` via scripts/database/combine-migrations.sh).

## Steps

1. **Infra**
   - Second Postgres database + init/migrations. Document how the management API
     connects to this store (MANAGEMENT_DB_*) and, separately, to main DB for main-user
     CRUD.

2. **Schema**
   - **Super admin:** Singleton (e.g. `super_admin` table with one row, or
     `management_users` with `is_super_admin` and constraint at most one true). Email +
     hashed password.
   - **Admins:** Table of admin users (email, hashed password, created_by, etc.).
   - **Admin permissions:** Per-admin: `admins_crud` and `users_crud` (0–15 CRUD bitmask:
     create=1, read=2, update=4, delete=8); `can_change_passwords`, `can_assign_permissions`;
     **event_visibility** (`own` | `all_admins` | `all`). Super admin sets these when
     creating/editing admins.
   - **Management events (audit log):** At least one table (e.g. `management_events`)
     tracking every action by a super admin or admin: actor_id, actor_type
     (super_admin | admin), action (e.g. admin_created, user_created, password_changed),
     target_type and target_id (optional), timestamp, optional details (JSON or text).
     Main apps do not have access to this table.

3. **Access layer**
   - Implement in `packages/management-orm/` or `apps/management-api/src/db/` (entities
     and services for management store only).

## Key files

- `infra/management-database/migrations/` and `infra/management-database/combined/` (same convention as database/; combine script generates both)
- `packages/management-orm/` or `apps/management-api/src/db/` for management-only entities

## Dependencies

None from other plans (can start once infra/scripts exist). Main ORM (12) is used by main
API only; management has its own store.

## Verification

- Management DB can be created/initialized; schema includes super_admin, admins,
  permissions, and management_events. Management API can connect and run migrations.
