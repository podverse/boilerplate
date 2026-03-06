---
name: roles-schema-sync
description: When changing DB schema or permission dimensions, consider predefined roles and bucket_role / role-related code.
---

# Roles and schema / permission changes

## When to use

When changing **DB schema** (especially permission-related columns or new resource types), or when **adding/removing CRUD dimensions** for bucket admins.

## What to consider

1. **Predefined roles** are defined in code (`packages/helpers/src/bucketRoles/constants.ts`) and may need:
   - New entries (e.g. a new predefined role id and nameKey).
   - Updated bitmasks (`bucketCrud`, `messageCrud`, `adminCrud`) if CRUD semantics change.
   - i18n keys in apps (e.g. `roles.full`, `roles.noUpdate`) and in management-web/originals.

2. **Custom roles** live in schema tables (`bucket_role`, `management_admin_role`). Adding columns or changing CRUD semantics may require:
   - Migrations and init SQL updates together (keep both in sync):
     - Main DB: `infra/database/migrations/*.sql` + `infra/database/combined/init_database.sql`
     - Management DB: `infra/management-database/migrations/*.sql` + `infra/management-database/combined/init_management_database.sql`
   - ORM entity and `BucketRoleService` updates.
   - Management-api schemas (Joi), controller, and OpenAPI updates.
   - Helpers-requests types and API helpers.

3. **UI** that lists or applies roles (dropdowns, Roles tab, role create/edit forms) may need to:
   - Reflect new permission dimensions or labels.
   - Update CrudCheckboxes or role option shapes if CRUD bits change.

## Key files

- Predefined: `packages/helpers/src/bucketRoles/constants.ts`
- DB (main): `infra/database/combined/init_database.sql`, `infra/database/migrations/*.sql`
- DB (management): `infra/management-database/combined/init_management_database.sql`, `infra/management-database/migrations/*.sql`
- ORM: `packages/orm` (BucketRole entity, BucketRoleService)
- API: `apps/management-api` (bucket roles routes, controller, schemas)
- Client: `packages/helpers-requests` (bucket roles), `packages/ui` (BucketAdminsView, EditBucketAdminForm, BucketSettingsTabs)
