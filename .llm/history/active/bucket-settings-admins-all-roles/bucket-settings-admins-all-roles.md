# Bucket Settings Admins – All Roles in Dropdown

**Started:** 2025-03-06  
**Context:** User reported not all roles available on Bucket Settings Admins page (Roles tab shows Admin Full, Admin Read, Bucket Full, Bucket Read; Admins tab dropdown showed only Bucket Full, Bucket Read, Custom Role).

## Session 1 – 2025-03-06

### Prompt (Developer)
It looks like not all roles are available on the Bucket Settings Admins page.

### Key Decisions
- API already returns all 4 predefined roles via `PREDEFINED_BUCKET_ROLES` in bucketRolesController; client had no explicit filter.
- Defensive fix: build Admins dropdown from `PREDEFINED_BUCKET_ROLES` (helpers) in canonical order, merging in API response when present, then append custom roles. Ensures Admin Full and Admin Read always appear even if API or parsing ever omits them.
- Order in dropdown: Admin Full, Admin Read, Bucket Full, Bucket Read, then custom roles.

### Files Created/Modified
- `apps/management-web/src/app/(main)/bucket/[id]/settings/BucketAdminsClient.tsx` – import `PREDEFINED_BUCKET_ROLES` and `PredefinedBucketRoleItem`; build `roleOptions` by mapping `PREDEFINED_BUCKET_ROLES` (use API role when present, else synthetic from constant), then custom roles from API.

## Session 2 – 2025-03-06

### Prompt (Developer)
Shared Bucket Admin Role Options (Web + Management-Web Parity). Implement the plan: single shared builder so web and management-web cannot diverge; web was still filtering out Admin Full and Admin Read.

### Key Decisions
- Added `buildBucketAdminRoleOptions` in `@boilerplate/helpers-requests` (new module `bucketAdminRoleOptions.ts`) using `PREDEFINED_BUCKET_ROLES` from helpers; helpers-requests gained dependency on `@boilerplate/helpers`.
- Both apps call the builder with `getLabel` / `getDescription` callbacks (i18n); no app-specific filter or merge logic.
- Web’s roles namespace already had descriptionBucketFull, descriptionBucketRead, descriptionCustomRole; no i18n changes.
- Fixed getLabel else-branch: return `role.name` for custom roles (TypeScript had narrowed to CustomBucketRoleItem so `role.id` fallback was typed as never).

### Files Created/Modified
- `packages/helpers-requests/package.json` – added dependency `@boilerplate/helpers`.
- `packages/helpers-requests/src/bucketAdminRoleOptions.ts` – new; `buildBucketAdminRoleOptions`, `BucketAdminRoleOptionShape`, `BuildBucketAdminRoleOptionsI18n`.
- `packages/helpers-requests/src/index.ts` – export new function and types.
- `apps/management-web/src/app/(main)/bucket/[id]/settings/BucketAdminsClient.tsx` – use `buildBucketAdminRoleOptions`, remove inline merge and `roleToOption`, remove PREDEFINED_BUCKET_ROLES/PredefinedBucketRoleItem imports.
- `apps/web/src/app/(main)/bucket/[id]/BucketAdminsClient.tsx` – use `buildBucketAdminRoleOptions`, remove `roleToOption` and filter that excluded Admin Full/Admin Read; getLabel/getDescription via tRoles.
- `apps/web/src/app/(main)/bucket/[id]/EditBucketAdminFormClient.tsx` – same as BucketAdminsClient (shared builder, tRoles for labels/descriptions).
