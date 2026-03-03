# Buckets / Topics / Messages

**Started:** 2025-03-02  
**Context:** Multi-file plan set (00-SUMMARY, 01–05) for Buckets (top-level), Topics (child buckets), messages, bucket admins, and public bucket page + submit.

---

### Session 1 - 2025-03-02

#### Prompt (Developer)
Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- Phase 4 and 5 implemented in boilerplate apps/web: list/create/edit bucket, bucket detail with topics and admins link, new topic page, bucket admins list + add (by User ID) + edit/delete, messages list + edit/delete, public bucket page (/b/[slug]), public submit form (/b/[slug]/submit).
- Public paths: `isPublicPath()` treats any path starting with `/b/` as public so unauthenticated users can view and submit.
- Button component in @boilerplate/ui has no `size` prop; removed all `size="small"` from new pages.
- Fixed packages/ui Text component: guard `styles.muted`/`styles.error`/`styles.sm` with `typeof x === 'string'` for strict TypeScript.

#### Files Created/Modified
- apps/web: buckets list (page, Card without action prop), new bucket (BucketForm), bucket detail ([id]/page), edit bucket ([id]/edit), topics new ([id]/topics/new, TopicForm), admins ([id]/admins, BucketAdminsClient), admins edit ([id]/admins/[userId]/edit, EditBucketAdminForm), messages ([id]/messages, MessagesList), message edit ([id]/messages/[messageId]/edit, EditMessageForm), public bucket (b/[slug]/page), public submit (b/[slug]/submit, PublicSubmitForm).
- apps/web: routes (isPublicPath includes /b/), AppHeader (Buckets nav), i18n buckets (cancel, save).
- packages/ui: Text.tsx (type guard for CSS module class names).

---

### Session 2 - 2025-03-03

#### Prompt (Developer)
The Public Page seem to be inaccessible without login. they should be visible without logging in

#### Key Decisions
- Proxy was using `PUBLIC_PATHS.includes(pathname)` for "is public", which only includes exact paths (/, /login, etc.), not `/b/` prefix. Switched to `isPublicPath(pathname)` so `/b/[id]` and `/b/[id]/submit` are treated as public and unauthenticated users are not redirected to login.

#### Files Modified
- apps/web/src/proxy.ts (import and use `isPublicPath` instead of `PUBLIC_PATHS` for the redirect check).

---

### Session 3 - 2025-03-03

#### Prompt (Developer)
the View button needs to be on web pages tables too. the bucket list should use the same table component as management web

#### Key Decisions
- Reused management-web table pattern in apps/web: added ResourceTableWithFilter, useTableFilterState, useDeleteModal, ConfirmDeleteModal (and SCSS), and BucketsTableWithFilter. Bucket list page now uses table with columns Name, Slug, Public; View (public bucket page), Edit, Delete; filter bar and Add bucket link.
- View links to public bucket route `/b/[id]`; Edit to bucket edit; Delete calls new reqDeleteBucket from @boilerplate/helpers-requests.
- Added parseFilterColumns to web server-request; added common.bucketsTable (actions, view, edit, delete), common.confirmDeleteBucket, errors.deleteFailed and buckets.slug in en-US and es i18n.

#### Files Created/Modified
- packages/helpers-requests: reqDeleteBucket in web/buckets.ts.
- apps/web: hooks/useTableFilterState.ts, hooks/useDeleteModal.ts; components/ResourceTableWithFilter.tsx + module.scss, ConfirmDeleteModal.tsx + module.scss, BucketsTableWithFilter.tsx; app/(main)/buckets/page.tsx (table + search params); lib/server-request.ts (parseFilterColumns).
- apps/web i18n: buckets.slug, common.bucketsTable, common.confirmDeleteBucket, errors.deleteFailed (en-US, es).

---

### Session 4 - 2025-03-03

#### Prompt (Developer)
do it

#### Key Decisions
- Moved generic table stack into @boilerplate/ui: ResourceTableWithFilter, ConfirmDeleteModal, useTableFilterState, useDeleteModal (and SCSS). useDeleteModal no longer does router.push(ROUTES.LOGIN); callers pass onSelfDelete that performs logout + redirect.
- Apps keep domain wrappers: BucketsTableWithFilter (web), AdminsTableWithFilter, UsersTableWithFilter (management-web); they import ResourceTableWithFilter and types from @boilerplate/ui.
- Removed FilterableTableRow from TableWithFilter index export to avoid clash; ResourceTableWithFilter's FilterableTableRow is the single exported row type for CRUD tables.

#### Files Created/Modified
- packages/ui: hooks/useDeleteModal.ts, hooks/useTableFilterState.ts; components/modal/ConfirmDeleteModal (tsx + scss), components/table/ResourceTableWithFilter (tsx + scss); index.ts exports.
- apps/web: BucketsTableWithFilter imports from @boilerplate/ui; removed ResourceTableWithFilter, ConfirmDeleteModal, useDeleteModal, useTableFilterState and their scss.
- apps/management-web: AdminsTableWithFilter and UsersTableWithFilter import from @boilerplate/ui; AdminsTableWithFilter onSelfDelete now does logout() + router.push(ROUTES.LOGIN); removed same duplicated components/hooks.
