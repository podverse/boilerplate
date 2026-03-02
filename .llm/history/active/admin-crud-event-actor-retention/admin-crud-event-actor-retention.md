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

---

### Session 6 - 2026-03-01

#### Prompt (Developer)
the permissions component needs the same max width rules as inputs. also, when i click the crud buttons, nothing happens. seems to be missing something.

#### Key Decisions
- Root cause of invisible checkboxes: `_reset.scss` applies `appearance: none` to all `input` elements (including `type="checkbox"`), stripping the native visual entirely. Fix: add a targeted exception in the reset for `input[type='checkbox']` restoring `appearance: auto`, `width`/`height: 1rem`, and `accent-color: var(--color-primary)` for theme-aware checked color.
- Max-width applied to both `FormSection.module.scss` (.section) and `CrudCheckboxes.module.scss` (.fieldset) using `$input-max-width` with the same `$breakpoint-sm` responsive rule as the Input component.

#### Files Modified
- `packages/ui/src/styles/_reset.scss` — restore native checkbox appearance
- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.module.scss` — max-width + breakpoint
- `packages/ui/src/components/form/FormSection/FormSection.module.scss` — max-width + breakpoint

---

### Session 7 - 2026-03-01

#### Prompt (Developer)
Instead of using the pattern where the border meets the middle of the header text for the permissions Put that header label inside the border and put a checkbox next to the label so that if you press it it checks all or unchecks all below it And if there are partial selections, then the checkbox should indicate a partial selected state rather than a Full check or uncheck

#### Key Decisions
- Replaced `<fieldset>` + `<legend>` with a `<div>` so the label renders fully inside the border (no fieldset notch effect)
- Select-all checkbox added to header row; uses `useRef` + `useEffect` to set `indeterminate` imperatively (not a React-controlled attribute)
- Indeterminate = some but not all bits checked; allChecked = all 4 bits true; clicking indeterminate/unchecked selects all, clicking checked deselects all
- CSS module updated: renamed `.fieldset` → `.container`, removed `.legend`, added `.headerLabel` with `margin-bottom` to separate header from checkboxes

#### Files Modified
- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.tsx`
- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.module.scss`

---

### Session 8 - 2026-03-01

#### Prompt (Developer)
Can change passwords and can assign permissions do not need to be their own permissions. They can be implied within the create or update permissions

#### Key Decisions
- `canChangePasswords` and `canAssignPermissions` removed entirely from the data model; these capabilities are implied by CRUD bits on the relevant resource (e.g. update on users → can change passwords; update on admins → can assign permissions)
- Removed from DB schema (0002 migration + combined SQL), ORM entity, ORM service types and usage, API controller, Joi schemas, serializer, helpers-requests types, AdminForm UI, i18n keys, and OpenAPI spec
- The openapi.ts description updated to reflect the simplified permissions model

#### Files Modified
- `infra/management-database/migrations/0002_admin_permissions.sql`
- `infra/management-database/combined/init_management_database.sql`
- `packages/management-orm/src/entities/AdminPermissions.ts`
- `packages/management-orm/src/services/ManagementUserService.ts`
- `apps/management-api/src/controllers/adminsController.ts`
- `apps/management-api/src/schemas/admins.ts`
- `apps/management-api/src/lib/managementUserToJson.ts`
- `packages/helpers-requests/src/types/management-admin-types.ts`
- `apps/management-web/src/components/admins/AdminForm.tsx`
- `apps/management-web/i18n/originals/en-US.json`
- `apps/management-web/i18n/originals/es.json`
- `apps/management-web/i18n/overrides/es.json`
- `apps/management-api/src/openapi.ts`

### Session 10 - 2026-03-01

#### Prompt (Developer)

On the Add Admin page, if you blur out of the display name without setting it, a error message should appear below it that's says it is required. If you blur out of the email input without setting a valid email address, it should say it's required in an error message. If you blur out of the password and it is not secure enough, it should say it's not secure enough. If you try to add an admin but it has zero permissions then it is useless and an error message should say the admin needs at least one Permission. If you give a field the create permission, then it must have the read permission and the UI should display that read is selected, but also disable it so the user cannot Disable it unless they disable create. If the user selects the update permission, thenread must be selected. And it should be disabled. All permissions should be selected enabled by default. Delete requires the read permission.

#### Key Decisions

- Blur-triggered validation for displayName, email, password; submit also touches all fields
- `withReadEnforced`: if create/update/delete is on, read is forced true
- `computeDisabledBits`: returns `{ read: true }` when any write bit is set; passed as `disabledBits` to `CrudCheckboxes`
- New admins (create mode) default to bitmask 15 (all permissions on) instead of 0
- `permissionsError` shown on first `CrudCheckboxes` only; fires if super admin and total bits = 0
- All validation messages added as i18n keys in `common.adminForm`
- `CrudCheckboxes` extended with `disabledBits` and `error` props; disabled labels get `opacity-disabled`

#### Files Modified

- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.tsx`
- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.module.scss`
- `apps/management-web/src/components/admins/AdminForm.tsx`
- `apps/management-web/i18n/originals/en-US.json`
- `apps/management-web/i18n/originals/es.json`
- `apps/management-web/i18n/overrides/es.json`

### Session 9 - 2026-03-01

#### Prompt (Developer)

default visibility should be all admins

#### Key Decisions

- Changed `eventVisibility` default from `'own'` to `'all_admins'` everywhere

#### Files Modified

- `packages/management-orm/src/entities/AdminPermissions.ts`
- `apps/management-api/src/schemas/admins.ts`
- `apps/management-api/src/openapi.ts`
- `apps/management-api/src/controllers/eventsController.ts`
- `apps/management-web/src/components/admins/AdminForm.tsx`
- `infra/management-database/migrations/0002_admin_permissions.sql`
- `infra/management-database/combined/init_management_database.sql`
- `apps/management-api/src/test/management-api.test.ts`
- `apps/management-api/src/test/management-admins-permissions.test.ts`
- `apps/management-api/src/test/management-users-permissions.test.ts`

### Session 11 - 2026-03-01

#### Prompt (Developer)

debug [TS error: Property 'canChangePasswords' does not exist on type 'AdminPermissions' in usersController.ts]

#### Key Decisions

- `canChangePasswords` check replaced with `(perm.usersCrud & 4) === 0` (update bit implies change-password)
- Test updated: removed `canChangePasswords: true`, changed `usersCrud: 2` → `usersCrud: 6` (read+update)
- Removed `canChangePasswords`/`canAssignPermissions` from `ManagementUserPermissions` local type in management-web

#### Files Modified

- `apps/management-api/src/controllers/usersController.ts`
- `apps/management-api/src/test/management-users-permissions.test.ts`
- `apps/management-web/src/types/management-api.ts`

### Session 12 - 2026-03-01

#### Prompt (Developer)

Wherever a set password input appears. The password validation meter should appear below it so the user knows if they have set a password that is strong enough or not

#### Key Decisions

- Only `AdminForm.tsx` in management-web sets a password (login uses existing UI auth forms which already include the meter)
- Meter shown always in create mode; in edit mode only when password field is non-empty
- `PasswordStrengthMeter` already exported from `@boilerplate/ui` — just needed importing

#### Files Modified

- `apps/management-web/src/components/admins/AdminForm.tsx`

### Session 13 - 2026-03-01

#### Prompt (Developer)

Instead of setting an input max width on individual components, the form itself should have a Max width

#### Key Decisions

- Removed `max-width: $input-max-width` (and responsive `max-width: none`) from Input, Select, FormSection, CrudCheckboxes — they now fill their container via `width: 100%`
- Auth forms are already constrained at the page/Card level; no changes needed there
- `TableFilterBar` left unchanged — it's a table control, not a form field
- New `AdminForm.module.scss` created with `.form { max-width: $input-max-width }` applied to the `<form>` element

#### Files Modified

- `packages/ui/src/components/form/Input/Input.module.scss`
- `packages/ui/src/components/form/Select/Select.module.scss`
- `packages/ui/src/components/form/FormSection/FormSection.module.scss`
- `packages/ui/src/components/form/CrudCheckboxes/CrudCheckboxes.module.scss`
- `apps/management-web/src/components/admins/AdminForm.tsx`

#### Files Created

- `apps/management-web/src/components/admins/AdminForm.module.scss`

### Session 14 - 2026-03-01

#### Prompt (Developer)

The max width should not only be on the admin form, but the higher order form component. If there isn't already a higher order form component there should be, also allow disabling Max with using a prop although I don't think there is anywhere that prop needs to be used right now.

#### Key Decisions

- The existing `Form` component (Card + title + Stack) is opinionated auth-form pattern; a new `FormContainer` is the right primitive
- `FormContainer` renders a plain `<form>` with `max-width: $input-max-width` by default; `constrainWidth={false}` removes the cap
- `AdminForm.tsx` now uses `FormContainer` instead of bare `<form>` + local module
- `AdminForm.module.scss` deleted

#### Files Created

- `packages/ui/src/components/form/FormContainer/FormContainer.tsx`
- `packages/ui/src/components/form/FormContainer/FormContainer.module.scss`
- `packages/ui/src/components/form/FormContainer/index.ts`

#### Files Modified

- `packages/ui/src/index.ts`
- `apps/management-web/src/components/admins/AdminForm.tsx`

#### Files Deleted

- `apps/management-web/src/components/admins/AdminForm.module.scss`

### Session 15 - 2026-03-01

#### Prompt (Developer)

The password requirements should be briefly listed above. the password strength meter and the password strength meter should say in text what each level represents like poor or fair Or whatever naming convention is most common for password rating strength

#### Key Decisions

- Requirements list (2 items: min length + character mix) always shown above the bar
- Strength label appears to the right of the bar: "Too short" / "Weak" / "Fair" / "Good" / "Strong" (per zxcvbn/NIST common convention)
- Strength 0 + has input shows 1 red segment so the bar is never empty while typing
- Color variables added to `_variables.scss` (static, not theme-aware — red/orange/amber/green universal)
- `showHint` prop removed; requirements list replaces the old hint text

#### Files Modified

- `packages/ui/src/styles/_variables.scss`
- `packages/ui/src/components/form/PasswordStrengthMeter/PasswordStrengthMeter.tsx`
- `packages/ui/src/components/form/PasswordStrengthMeter/PasswordStrengthMeter.module.scss`
- `apps/web/i18n/originals/en-US.json`
- `apps/web/i18n/originals/es.json`
- `apps/web/i18n/overrides/es.json`
- `apps/management-web/i18n/originals/en-US.json`
- `apps/management-web/i18n/originals/es.json`
- `apps/management-web/i18n/overrides/es.json`

### Session 16 - 2026-03-01

#### Prompt (Developer)

I just created a user admin in the management and logged in with that new admin. And I gave it full CRUD permissions, but I don't see an add admin button and I don't see edit or delete next to admins on the admins screen. And they should

#### Key Decisions

- `showActions = isSuperAdmin` was wrong — it must also respect CRUD bitmask permissions
- Replaced `isSuperAdmin` prop with `canUpdateAdmin` + `canDeleteAdmin` in `AdminsTableWithFilter`
- Edit and Delete buttons are now independently gated by their respective permission bits
- `addAdminHref` is now passed whenever `canCreateAdmin` is true (bit 1 of `adminsCrud`), not just for super admins
- Bitmask values: create=1, read=2, update=4, delete=8

#### Files Modified

- `apps/management-web/src/app/(main)/admins/page.tsx`
- `apps/management-web/src/components/AdminsTableWithFilter.tsx`
