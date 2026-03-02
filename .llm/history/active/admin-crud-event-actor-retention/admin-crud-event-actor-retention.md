# Admin CRUD UI and event actor retention

**Started:** 2026-03-01
**Author:** Agent
**Context:** Add full admin create/edit/delete UI to management-web, preserve actor identity in events after admin deletion via a new `actor_display_name` column, and ensure all management-api endpoints are protected (already confirmed).

---

### Session 1 - 2026-03-01

#### Prompt (Developer)
The management API and web Need the ability for the super admin to create other admins There should be a button on the admins page that says add admin There should be buttons on the admin rows that say edit and delete. If delete is pressed, there should be a confirmation prompt. Before deleting if An admin is deleted, the event records should not be deleted. So the events should be non-cascading and not immediately dependent on the existence of admins. Perhaps the event table needs a new column so you know or have some idea what the events who created those events even though the admin row it corresponded with at one point was deleted. The edit admin page should take you to an edit admin page that has the ID of the admin in the path and it lets you Change the display name or email or password of the admin And then press a submit button to save. It should also let you select Permission toggles for crud purposes to enable or disable the ability of those admins to perform various CRUD operations The Add Admin page should have similar fields and permission setting checkboxes. All of the endpoints in management API should Be protected where they check that the admin that called the endpoint either has permissions or it's the super admin. If it's the case of the super admin, then they can always Ways perform the actions.

(Follow-up prompts):
- "your sql changes should update the existing create tables, NOT alter tables or drop them. assume a clean slate environment"
- "if an admin changes their name later, then the actor_display_name should be updated to match at the same time, if there are any events they created"

#### Key Decisions
- Added `actor_display_name TEXT` directly to `CREATE TABLE management_event` in migration 0003 (no ALTER TABLE)
- `actor_display_name` is captured at event creation time from `actor.bio.displayName`
- When an admin updates their display name, `ManagementEventService.updateActorDisplayName` bulk-updates all existing event records for that actor
- `AdminsTableWithFilter` was rewritten to render its own table (using `Table`, `TableFilterBar`, `Pagination` components) with an "Actions" column rather than extending `TableWithFilter` which only supports string cells
- Edit/Delete actions visible only to super admins (via `isSuperAdmin` prop)
- Delete fires `deleteAdmin` from `helpers-requests` then calls `router.refresh()`
- `AdminForm` is a shared client component used by both `/admins/new` and `/admins/[id]/edit`
- Permission toggles (bitmask CRUD checkboxes for adminsCrud/usersCrud, boolean flags, eventVisibility select) shown only when `isSuperAdmin` is true
- `ServerUser` extended to include `isSuperAdmin` field (read from `/auth/me` response)
- Events table updated to show `actorDisplayName` (falls back to `actorId`) with `actorType` in the Actor column

#### Files Created
- `infra/management-database/migrations/0003_management_event.sql` — added `actor_display_name TEXT`
- `infra/management-database/combined/init_management_database.sql` — regenerated
- `apps/management-web/src/components/admins/ConfirmDeleteAdminModal.tsx` — new
- `apps/management-web/src/components/admins/AdminForm.tsx` — new
- `apps/management-web/src/app/(main)/admins/new/page.tsx` — new
- `apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx` — new

#### Files Modified
- `packages/management-orm/src/entities/ManagementEvent.ts` — added `actorDisplayName` column
- `packages/management-orm/src/services/ManagementEventService.ts` — added `actorDisplayName` to `record()`, added `updateActorDisplayName()`
- `apps/management-api/src/lib/recordEvent.ts` — passes `actor.bio?.displayName` as `actorDisplayName`
- `apps/management-api/src/controllers/eventsController.ts` — added `actorDisplayName` to `eventToJson`
- `apps/management-api/src/controllers/adminsController.ts` — imported `ManagementEventService`, calls `updateActorDisplayName` after display name change
- `apps/management-api/src/openapi.ts` — added `actorDisplayName` to Event schema
- `packages/helpers-requests/src/management-web/admins.ts` — added `getAdmin`, `createAdmin`, `updateAdmin`, `deleteAdmin`
- `packages/helpers-requests/src/types/management-event-types.ts` — added `actorDisplayName` to `PublicManagementEvent`
- `apps/management-web/src/lib/routes.ts` — added `ADMINS_NEW`, `adminEditRoute()`
- `apps/management-web/src/lib/server-auth.ts` — added `isSuperAdmin` to `ServerUser`
- `apps/management-web/src/app/(main)/admins/page.tsx` — Add Admin button, passes `isSuperAdmin`, `adminApiBaseUrl`, `adminEditRoute` to table
- `apps/management-web/src/components/AdminsTableWithFilter.tsx` — rewritten with Edit/Delete action column
- `apps/management-web/src/app/(main)/events/page.tsx` — shows actor display name in events table
- `apps/management-web/src/types/management-api.ts` — added `ManagementEvent` type, `actorDisplayName` and extra fields to `ManagementUser`

---

### Session 2 - 2026-03-01

#### Prompt (Developer)
review all of your changes. the inline styles should all be changed to classes that get set in scss files. the user facing strings and aria all need to be i18n compatible

#### Key Decisions
- Created SCSS modules for every new component using `@boilerplate/ui/styles/variables` tokens (no inline styles remain)
- All user-facing strings use `useTranslations` / `getTranslations`; new keys added under `common.adminForm`, `common.confirmDeleteAdmin`, `common.addAdmin`, `common.addAdminTitle`, `common.editAdminTitle`, `common.adminsTable.*`, `common.eventsTable.actor`, `errors.deleteFailed`
- Added `eventsTable.actor` key (keeps `actorType` in JSON for parity) and updated events page column to use it
- Both `en-US.json` and `es.json` updated in sync; `i18n:compile` and `i18n:validate` pass clean

#### Files Created
- `apps/management-web/src/components/AdminsTableWithFilter.module.scss`
- `apps/management-web/src/components/admins/AdminForm.module.scss`
- `apps/management-web/src/components/admins/ConfirmDeleteAdminModal.module.scss`
- `apps/management-web/src/app/(main)/admins/admins.module.scss`

#### Files Modified
- `apps/management-web/src/components/AdminsTableWithFilter.tsx` — SCSS classes, i18n strings
- `apps/management-web/src/components/admins/AdminForm.tsx` — SCSS classes, i18n strings
- `apps/management-web/src/components/admins/ConfirmDeleteAdminModal.tsx` — SCSS classes, i18n strings
- `apps/management-web/src/app/(main)/admins/page.tsx` — SCSS for Add Admin button, i18n key
- `apps/management-web/src/app/(main)/admins/new/page.tsx` — i18n card title
- `apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx` — i18n card title
- `apps/management-web/src/app/(main)/events/page.tsx` — use `eventsTable.actor` key
- `apps/management-web/i18n/originals/en-US.json` — new keys
- `apps/management-web/i18n/originals/es.json` — new keys (Spanish)

---

### Session 3 - 2026-03-01

#### Prompt (Developer)
review all the test and openapi files for any gaps that should be addressed

#### Key Decisions
- `/admins` GET OpenAPI: added `page`, `limit`, `search` query params; response now documents `total`, `page`, `limit`, `totalPages`, and optional `truncatedTotal`
- `/events` GET OpenAPI: replaced incorrect `offset` param with `page`; added `sort` (recent/oldest) and `search` params; response now documents `total`, `page`, `limit`, `totalPages`, optional `truncatedTotal`
- Note: `/users` GET is intentionally unpaginated (returns all rows), no change needed there
- Added tests for `GET /events` response shape (pagination fields)
- Added new describe block for `actorDisplayName` behavior: stored at event creation, updated when admin display name changes, events survive admin deletion

#### Files Modified
- `apps/management-api/src/openapi.ts` — pagination params and response for /admins GET and /events GET
- `apps/management-api/src/test/management-api.test.ts` — events response shape test, new actorDisplayName behavior tests

---

### Session 4 - 2026-03-01

#### Prompt (Developer)
@boilerplate/apps/management-web/src/components/admins/ConfirmDeleteAdminModal.module.scss:5 this min-width should be a variable.
@boilerplate/apps/management-web/src/components/admins/ConfirmDeleteAdminModal.module.scss:27 this opacity should be a variable.
@boilerplate/apps/management-web/src/components/admins/AdminForm.tsx:14-22 it seems like CRUD bits like this could be in a helpers package and imported wherever they are needed because it will apply to many tables in the future
@boilerplate/apps/management-web/src/components/admins/AdminForm.tsx:43-59 these seem like they could move to a helpers also
@boilerplate/apps/management-web/src/components/admins/AdminForm.tsx:61-95 crud checkboxes seems like it could be a reusable component in ui package

#### Key Decisions
- Added `$dialog-min-width: 20rem` and `$opacity-hover: 0.9` to `packages/ui/src/styles/_variables.scss`
- `CrudCheckboxes` in `@boilerplate/ui` accepts `labels: Record<CrudBit, string>` as a prop instead of calling `useTranslations` internally, keeping it translation-agnostic; `AdminForm` resolves labels via `useTranslations` and passes them down
- Retained `.checkboxLabel` in `AdminForm.module.scss` for the standalone boolean checkboxes (`canChangePasswords`, `canAssignPermissions`) that are not part of `CrudCheckboxes`

#### Files Created
- `packages/helpers/src/crud/crud-bitmask.ts` — CRUD_BITS, CrudBit, bitmaskToFlags, flagsToBitmask
- `packages/ui/src/components/CrudCheckboxes/CrudCheckboxes.tsx`
- `packages/ui/src/components/CrudCheckboxes/CrudCheckboxes.module.scss`
- `packages/ui/src/components/CrudCheckboxes/index.ts`
- `packages/ui/src/components/CrudCheckboxes/CrudCheckboxes.stories.tsx`

#### Files Modified
- `packages/ui/src/styles/_variables.scss` — added $dialog-min-width, $opacity-hover
- `packages/ui/src/index.ts` — exported CrudCheckboxes, CrudCheckboxesProps, CrudFlags
- `packages/helpers/src/index.ts` — exported CRUD_BITS, CrudBit, bitmaskToFlags, flagsToBitmask
- `apps/management-web/src/components/admins/ConfirmDeleteAdminModal.module.scss` — use $dialog-min-width, $opacity-hover
- `apps/management-web/src/components/admins/AdminForm.tsx` — import from packages; removed local CRUD_BITS, CrudBit, bitmaskToFlags, flagsToBitmask, CrudCheckboxes
- `apps/management-web/src/components/admins/AdminForm.module.scss` — removed .fieldset, .legend, .checkboxGroup (moved to UI package)

---

### Session 5 - 2026-03-01

#### Prompt (Developer)
anticipate that there will be many pages that these permissions need to be set for. should more of these styles be abstracted? should they be moved into yet another ui component?

#### Key Decisions
- Three new primitive UI components added to `@boilerplate/ui`: `CheckboxField`, `FormSection`, `FormActions`
- `CheckboxField` uses `useId` for accessible label/input association (matching the `Input` component pattern)
- `FormSection` uses a `<div>` wrapper (not `<fieldset>`) to avoid nesting conflict with `CrudCheckboxes` which already renders `<fieldset>`
- `FormActions` uses `$space-3` gap (vs `Row`'s `$space-4`) to match form button spacing
- `<form>` in `AdminForm.tsx` now uses the global `.stack` CSS class (identical to old `.form` local class)
- `AdminForm.module.scss` deleted — no local styles remain

#### Files Created
- `packages/ui/src/components/CheckboxField/CheckboxField.tsx`
- `packages/ui/src/components/CheckboxField/CheckboxField.module.scss`
- `packages/ui/src/components/CheckboxField/index.ts`
- `packages/ui/src/components/CheckboxField/CheckboxField.stories.tsx`
- `packages/ui/src/components/FormSection/FormSection.tsx`
- `packages/ui/src/components/FormSection/FormSection.module.scss`
- `packages/ui/src/components/FormSection/index.ts`
- `packages/ui/src/components/FormSection/FormSection.stories.tsx`
- `packages/ui/src/components/FormActions/FormActions.tsx`
- `packages/ui/src/components/FormActions/FormActions.module.scss`
- `packages/ui/src/components/FormActions/index.ts`
- `packages/ui/src/components/FormActions/FormActions.stories.tsx`

#### Files Modified
- `packages/ui/src/index.ts` — exported CheckboxField, FormSection, FormActions
- `apps/management-web/src/components/admins/AdminForm.tsx` — uses new UI components; `className="stack"` on form

#### Files Deleted
- `apps/management-web/src/components/admins/AdminForm.module.scss`
