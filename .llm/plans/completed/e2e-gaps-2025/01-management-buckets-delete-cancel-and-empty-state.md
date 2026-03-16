# 01 – Management-Web: Buckets Delete Cancel and Empty State

## Gap 1: Buckets list delete cancel path

**Issue:** Admins and users list specs have a test that opens the delete confirmation (modal), clicks Cancel, and asserts the row remains. The buckets list has only the confirm-delete path; cancel is untested.

**Fix:**

- In [apps/management-web/e2e/buckets-super-admin-full-crud.spec.ts](apps/management-web/e2e/buckets-super-admin-full-crud.spec.ts), add a test following the same pattern as the admins delete-cancel test:
  1. Create a bucket (reuse existing create flow or same steps as the delete test).
  2. Navigate to buckets list with search so the created bucket row is visible.
  3. Click the row’s delete button to open the modal.
  4. Click the modal’s **Cancel** button (e.g. `page.locator('button').filter({ hasText: /cancel/i }).last()` or equivalent).
  5. Assert the bucket row is still present (e.g. `page.locator('tr', { hasText: bucketName }).toHaveCount(1)`).

**Reference:** [admins-super-admin-full-crud.spec.ts](apps/management-web/e2e/admins-super-admin-full-crud.spec.ts) test "When the user opens the delete confirmation for a created admin on the admins-list-page and cancels, the row remains."

**Verification:** `make e2e_test_management_web_report_spec SPEC=e2e/buckets-super-admin-full-crud.spec.ts`

---

## Gap 2: Management-web deterministic empty state

**Issue:** Web has a buckets-list empty-state test (search with no match + empty message + add-bucket link). Management-web has no equivalent for users or events list.

**Fix:**

- Add **one** deterministic empty-list test for management-web:
  - **Option A (users list):** In a new spec or in an existing users-list spec, navigate to `/users?search=nomatchever123` (or a similar term that matches no seeded user), assert the empty-state message is visible and optionally that a primary CTA (e.g. "Add user" link) is present if the UI shows it on empty.
  - **Option B (events list):** Navigate to `/events` with a filter/search that returns zero events (if the events page supports a no-match query), assert empty message.
- Prefer Option A if the users list supports a search param and shows an empty state; otherwise Option B. If neither supports a deterministic no-match in current seed, add a short comment in the plan that empty-state for that surface is deferred until search/filter is available.

**Verification:** Run the new or updated spec via `make e2e_test_management_web_report_spec SPEC=e2e/<spec>.spec.ts`.
