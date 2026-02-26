# Plan 31: Management database

## Scope

Dedicated store for management identities, permissions, and **audit events**. No main-app
users are stored here. The management API uses this store for super admin, admins, their
permissions, and the events table; it uses the main app Postgres (plan 12) only for
main-system user CRUD.

## Database choice

- **Default:** SQLite (e.g. `data/management.sqlite` or under `infra/`) — minimal footprint,
  no extra service. Document the option to use a second Postgres database for teams that
  prefer one engine or multi-instance deployments.
- **Second Postgres:** Optional; e.g. `management_db` in docker-compose; same migrations
  tooling as main.

## Steps

1. **Infra**
   - Add SQLite file path + init/migrations (or second Postgres service + migrations).
   - Document how the management API connects to this store and, separately, to main DB
     for main-user CRUD.

2. **Schema**
   - **Super admin:** Singleton (e.g. `super_admin` table with one row, or
     `management_users` with `is_super_admin` and constraint at most one true). Email +
     hashed password.
   - **Admins:** Table of admin users (email, hashed password, created_by, etc.).
   - **Admin permissions:** Per-admin flags: `can_manage_admins`, `can_manage_users`,
     `can_change_passwords`, `can_assign_permissions`; and **event_visibility** (`own` |
     `all_admins` | `all`). Super admin sets these when creating/editing admins.
   - **Management events (audit log):** At least one table (e.g. `management_events`)
     tracking every action by a super admin or admin: actor_id, actor_type
     (super_admin | admin), action (e.g. admin_created, user_created, password_changed),
     target_type and target_id (optional), timestamp, optional details (JSON or text).
     Main apps do not have access to this table.

3. **Access layer**
   - Implement in `packages/orm-management/` or `apps/management-api/src/db/` (entities
     and services for management store only).

## Key files

- `infra/database/management/` (migrations or SQLite init)
- `packages/orm-management/` or `apps/management-api/src/db/` for management-only entities

## Dependencies

None from other plans (can start once infra/scripts exist). Main ORM (12) is used by main
API only; management has its own store.

## Verification

- Management DB can be created/initialized; schema includes super_admin, admins,
  permissions, and management_events. Management API can connect and run migrations.
