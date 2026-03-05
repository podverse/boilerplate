# Helpers-requests, skill, tests, docs

## 4.1 Helpers-requests

In `packages/helpers-requests` (management-web API helpers):

- Add helpers for:
  - GET /buckets/:id/roles (list predefined + custom)
  - POST /buckets/:id/roles (create custom role)
  - PATCH /buckets/:id/roles/:roleId (update custom role)
  - DELETE /buckets/:id/roles/:roleId (delete custom role)
- Add types for role payloads and responses. Distinguish predefined vs custom (e.g. `isPredefined`
  or id format). Ensure BucketAdminsClient (and invite flow) can load roles and pass them into
  BucketAdminsView.

## 4.2 Skill: roles and schema/permission changes

Create `.cursor/skills/roles-schema-sync/SKILL.md` in the boilerplate repo.

- **When to use**: When changing DB schema (especially permission-related columns or new
  resource types), or when adding/removing CRUD dimensions for bucket admins.
- **Content**:
  - Predefined roles are defined in code and may need new entries or updated bitmasks.
  - Custom roles live in `bucket_role`; adding columns or changing CRUD semantics may require
    migrations and ORM/API updates.
  - UI that lists or applies roles (dropdowns, Roles tab) may need to reflect new permission
    dimensions or labels.

## 4.3 Testing

- **API tests**: Management-api tests for bucket roles: list (predefined + custom), create,
  update, delete; 404 for wrong bucket or role; validation of crud 0–15 and name.
- **E2E** (optional): Playwright flows for Roles tab (create role, edit custom role, delete
  custom role) and for add-admin with role selection and "Create new role" round-trip. See
  e2e-page-tests skill.

## 4.4 Docs

Update `docs/buckets/OWNER-AND-ADMINS.md`:

- Describe roles (predefined vs custom).
- State that admins and invitations are assigned via role selection.
- Link to Roles tab and create/edit role pages.
