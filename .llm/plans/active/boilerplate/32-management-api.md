# Plan 32: Management API

## Scope

Express app `apps/management-api`: auth for management users only (super admin + admins),
JWT, permission checks on every admin action. **Audit logging** and **events API** for the
management web. Fully separate from the main API; admin powers live here when management
is present.

## Steps

1. **Bootstrap super admin**
   - Exactly one super admin allowed. Create from env on first run (or CLI/one-time
     script). Store in management DB (plan 31).

2. **Auth**
   - Login (super admin or admin); issue JWT (e.g. MANAGEMENT_JWT_SECRET). Middleware:
     requireManagementAuth, requireSuperAdmin, requirePermission(permission).

3. **Endpoints**
   - Create/delete admin (with permission flags and **event_visibility**); create/delete
     main-system user (calls main DB/ORM from plan 12); change password (admin or main
     user); list admins/users; update admin permissions (super admin only).
   - **Record an event** in the management DB whenever a super admin or admin performs
     any of these actions (actor, action, target, timestamp).

4. **GET /events (audit log)**
   - Returns events. **Super admin** always sees all events. **Admins** see events
     according to their **event_visibility**: `own` (only events they performed),
     `all_admins` (events by any admin), or `all` (events by all admins and super admin).

5. **Main DB access**
   - Management API has read-write connection to main app Postgres for main-user CRUD
     only. All management identity, permissions, and events stay in management DB (plan 31).

## Key files

- `apps/management-api/` (routes, controllers, middleware)
- Env validation: MANAGEMENT_JWT_SECRET, main DB connection for user CRUD, management DB
  path or URL

## Dependencies

- Plan 31 (management DB)
- Plan 12 (main ORM / schema) for main-user CRUD

## Verification

- Super admin can log in and create/delete admins and main users; change passwords;
  assign permissions and event_visibility. Admins can perform only actions allowed by
  their permissions. GET /events returns events filtered by role and event_visibility.
  Every auditable action writes an event.
