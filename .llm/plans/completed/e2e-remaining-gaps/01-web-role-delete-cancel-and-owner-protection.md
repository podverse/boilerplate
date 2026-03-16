# 01 – Web Role Delete Cancel and Owner Protection

## Gap 1: Web role delete cancel path

**Issue:** Bucket role delete has confirm path only. No test asserts "click delete → cancel/reject dialog → role still in list."

**Fix:**

- In [apps/web/e2e/bucket-role-edit-seeded-bucket-owner.spec.ts](apps/web/e2e/bucket-role-edit-seeded-bucket-owner.spec.ts), add a test:
  1. Create a role (same pattern as existing delete test).
  2. Trigger delete (click delete button).
  3. **Reject** the browser confirm dialog via `page.once('dialog', d => d.dismiss())`.
  4. Assert the role row is still visible and the list still contains the role name.

**Verification:** `make e2e_test_web_report_spec SPEC=e2e/bucket-role-edit-seeded-bucket-owner.spec.ts`

---

## Gap 2: Bucket admin owner-protection assertions

**Issue:** Matrix calls out "owner protection branch assertions" and "admin action visibility by ownership/permission." Owner row should not offer delete.

**Fix:**

- In [apps/web/e2e/bucket-settings-seeded-bucket-owner.spec.ts](apps/web/e2e/bucket-settings-seeded-bucket-owner.spec.ts) (admins tab): add an assertion that the **owner row** (row containing "(owner)" or the seeded owner label) has no delete button, e.g. `ownerRow.getByRole('button', { name: /delete/i }).toHaveCount(0)`. Use existing seed (e2e@example.com as owner).

**Verification:** `make e2e_test_web_report_spec SPEC=e2e/bucket-settings-seeded-bucket-owner.spec.ts`
