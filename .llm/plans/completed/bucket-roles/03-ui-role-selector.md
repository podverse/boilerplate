# UI: role selector instead of permission checkboxes

## 3.1 Add-admin flow – BucketAdminsView

In `packages/ui/src/components/bucket/BucketAdminsView/BucketAdminsView.tsx`:

- **Replace** the three CrudCheckboxes (bucket, message, admin) with a **role** dropdown.
- Options: predefined roles + custom roles for this bucket + "Create new role…".
- When user selects "Create new role…": navigate to
  `bucketSettingsRoleNewRoute(bucketId)` with `returnUrl` pointing to current admins tab so
  after saving the role they return and can pick the new role.
- On form submit: resolve selected option to `(bucketCrud, messageCrud, adminCrud)` from the
  chosen role and call existing `onCreateInvitation` with that payload.
- Permission selectors are **not** shown or interactable here.

Props: BucketAdminsView will need e.g. `roles` (list of role options with id, label, crud
values) and `getRoleNewHref` / `onCreateRoleNavigate` so the parent can pass bucketId and
returnUrl. Parent (BucketAdminsClient) loads roles via GET /buckets/:id/roles and passes
them in.

## 3.2 Edit-admin flow – EditBucketAdminForm

- Replace the three CrudCheckboxes with a **role** dropdown (predefined + bucket custom roles).
- If the current admin’s CRUD does not match any role: show "Custom (no matching role)" or
  the closest match; user can pick a role to apply (overwrites admin’s CRUD).
- Submit: PATCH admin with the selected role’s CRUD.
- Optional: when a custom role is selected, show "Edit role" link to that role’s edit page.
- Permission selectors are **not** shown or editable on the edit-admin form.

EditBucketAdminForm (or its wrapper in management-web) will need `roles` and the current
admin’s CRUD to pre-select the matching role. Parent loads roles and passes them in.

## 3.3 Summary

Permission selectors (CrudCheckboxes) appear **only** on:

- Bucket-specific **Create role** page
- Bucket-specific **Edit role** page

They do **not** appear on the bucket settings Admins tab (add admin or edit admin).
