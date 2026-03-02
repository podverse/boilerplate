# Admins Users DRY Refactor

**Started:** 2025-03-02  
**Context:** Plan: Admins and Users Pages DRY and Consistency Refactor (server helpers, ConfirmDeleteModal, hooks, ResourceTableWithFilter, optional ResourcePageCard).

---

### Session 1 - 2025-03-02

#### Prompt (Developer)

Admins and Users Pages: DRY and Consistency Refactor

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Finished todo 3: refactored AdminsTableWithFilter to use useTableFilterState and useDeleteModal; added searchSyncParams to useTableFilterState for admins page reset.
- ConfirmDeleteModal: added optional confirmLoading prop and pass deleteLoading from both tables; onSelfDelete type fixed by wrapping logout in async () => { logout(); }.
- Todo 4: Added ResourceTableWithFilter (generic component + ResourceTableWithFilter.module.scss); AdminsTableWithFilter and UsersTableWithFilter are thin wrappers; removed AdminsTableWithFilter.module.scss and UsersTableWithFilter.module.scss.
- Todo 5: Added ResourcePageCard (Container > Stack > Card with optional error); updated admins/users list, new, and edit pages (six pages) to use it.

#### Files Created/Modified

- apps/management-web/src/hooks/useTableFilterState.ts (searchSyncParams option)
- apps/management-web/src/components/AdminsTableWithFilter.tsx (use hooks, then thin wrapper)
- apps/management-web/src/components/ConfirmDeleteModal.tsx (confirmLoading prop)
- apps/management-web/src/components/UsersTableWithFilter.tsx (confirmLoading prop)
- apps/management-web/src/components/ResourceTableWithFilter.tsx (new)
- apps/management-web/src/components/ResourceTableWithFilter.module.scss (new)
- apps/management-web/src/components/ResourcePageCard.tsx (new)
- apps/management-web/src/app/(main)/admins/page.tsx (ResourcePageCard)
- apps/management-web/src/app/(main)/users/page.tsx (ResourcePageCard)
- apps/management-web/src/app/(main)/admins/new/page.tsx (ResourcePageCard)
- apps/management-web/src/app/(main)/users/new/page.tsx (ResourcePageCard)
- apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx (ResourcePageCard)
- apps/management-web/src/app/(main)/users/[id]/edit/page.tsx (ResourcePageCard)
- Deleted: AdminsTableWithFilter.module.scss, UsersTableWithFilter.module.scss
