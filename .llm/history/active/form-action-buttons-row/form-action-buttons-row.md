# Form / View Action Buttons in a Row

**Started:** 2026-03-05
**Context:** View User and View Admin pages showed Edit and Cancel buttons in a column (Stack). They should match form patterns and display in a horizontal row (FormActions).

---

### Session 1 - 2026-03-05

#### Prompt (Developer)
scan through buttons in forms like this across all files. they should be in a row instead of a column

#### Key Decisions
- View User and View Admin detail pages were the only places using a Stack around only action buttons (Edit + Cancel ButtonLinks). Forms (AdminForm, UserForm, BucketForm, etc.) already use FormActions for submit/cancel.
- Replaced the inner Stack with FormActions on both view pages so Edit and Cancel appear in a row.

#### Files Created/Modified
- `apps/management-web/src/app/(main)/user/[id]/page.tsx` — import FormActions; wrap Edit/Cancel ButtonLinks in FormActions instead of Stack
- `apps/management-web/src/app/(main)/admin/[id]/page.tsx` — import FormActions; wrap Edit/Cancel ButtonLinks in FormActions instead of Stack

---

### Session 2 - 2026-03-05

#### Prompt (Developer)
scan through all the forms with submit / cancel button patterns. cancel should be in start position and submit should be in end

#### Key Decisions
- Standardized order: Cancel (or back/secondary) first (start), Submit (or primary action) second (end) in all FormActions and view-page button groups.
- View pages: Cancel link first, Edit link second. Forms: Cancel button first, Submit button second. UserForm create success: Back to list first, Copy link second.
- ConfirmDeleteModal and PublicSubmitForm unchanged (already correct or submit-only).

#### Files Created/Modified
- `apps/management-web/src/app/(main)/user/[id]/page.tsx` — FormActions: Cancel first, Edit second
- `apps/management-web/src/app/(main)/admin/[id]/page.tsx` — FormActions: Cancel first, Edit second
- `apps/management-web/src/components/admins/AdminForm.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/components/users/UserForm.tsx` — FormActions: Cancel first, Submit second; create success: Back to list first, Copy link second
- `apps/management-web/src/components/buckets/BucketForm.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/components/buckets/BucketMessageEditClient.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/app/(main)/bucket/[id]/new/NewChildBucketFormClient.tsx` — FormActions: Cancel first, Submit second
- `packages/ui/src/components/bucket/EditBucketAdminForm/EditBucketAdminForm.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/components/admins/AdminRoleForm.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/BucketRoleFormClient.tsx` — FormActions: Cancel first, Submit second
- `apps/web/src/app/(main)/bucket/[id]/BucketRoleFormClient.tsx` — FormActions: Cancel first, Submit second
- `apps/web/src/app/(main)/buckets/TopicForm.tsx` — FormActions: Cancel first, Submit second
- `apps/management-web/src/components/buckets/BucketMessagesClient.tsx` — FormActions: Cancel first, Submit second
- `apps/web/src/app/(main)/bucket/[id]/EditMessageForm.tsx` — FormActions: Cancel first, Submit second
