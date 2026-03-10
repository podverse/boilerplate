# 01 – Events List Empty State and Admins List Self-Protection

## Gap 1: Events list empty state

**Issue:** The management-web users list has a deterministic empty-state test (search with no match → empty message). The events list supports `search` and shows `emptyMessage` when there are no events (see `apps/management-web/src/app/(main)/events/page.tsx`: `emptyMessage={events.length === 0 ? tCommon('noEvents') : undefined}`). There is no E2E test for this.

**Fix:**

- In [apps/management-web/e2e/events-list-url-state-contract.spec.ts](apps/management-web/e2e/events-list-url-state-contract.spec.ts), add a test:
  1. Log in as super-admin.
  2. Navigate to `/events?search=nomatchever123` (or a search term that matches no seeded events).
  3. Assert the URL preserves the search param (`expect(url.searchParams.get('search')).toBe('nomatchever123')`).
  4. Assert the events heading is visible.
  5. Assert an empty-state message is visible (e.g. `page.getByText(/no events|no results|no matches/i).first()` – use a pattern that matches the app’s `noEvents` translation).

**Verification:** `make e2e_test_management_web_report_spec SPEC=e2e/events-list-url-state-contract.spec.ts`

---

## Gap 2: Admins list self-protection (current user row has no delete)

**Issue:** The CRUD matrix calls out "delete lifecycle incl. self/superadmin restrictions" and "row-level action gating". The admins page passes `currentUserId={user.id}` to the table; the UI should not offer delete for the logged-in admin’s own row (so a super-admin cannot delete themselves). This is currently untested.

**Fix:**

- In [apps/management-web/e2e/admins-super-admin-full-crud.spec.ts](apps/management-web/e2e/admins-super-admin-full-crud.spec.ts) (or a dedicated admins-authz spec if preferred), add a test:
  1. Log in as super-admin (e2e-superadmin).
  2. Navigate to the admins list (e.g. `/admins` or `/admins?search=e2e-superadmin` so the current user’s row is visible).
  3. Locate the row for the current user (e.g. row containing "e2e-superadmin" or "E2E Super Admin").
  4. Assert that row has **no** delete button, e.g. `await expect(currentUserRow.getByRole('button', { name: /delete/i })).toHaveCount(0);`

If the UI uses a disabled delete button instead of hiding it, assert the button is disabled. If the app does not implement self-protection (delete is shown for own row), document that in the plan and skip or defer the test.

**Verification:** `make e2e_test_management_web_report_spec SPEC=e2e/admins-super-admin-full-crud.spec.ts`
