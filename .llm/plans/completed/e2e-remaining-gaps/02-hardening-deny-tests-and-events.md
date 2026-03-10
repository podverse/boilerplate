# 02 – Hardening: Deny Tests (Real IDs) and Events Own-Only

## Web: Permission-deny tests use real resource IDs

**Issue:** Hardening follow-up: "Web forbidden tests use invalid resource IDs." Deny tests should use valid seeded IDs so the app returns 403/forbidden, not 404.

**Fix:**

- Confirm [bucket-role-edit-admin-without-permission.spec.ts](apps/web/e2e/bucket-role-edit-admin-without-permission.spec.ts) uses a real role id (it creates a role then uses that id as admin-without-permission) – already correct.
- For [bucket-message-edit-admin-without-permission.spec.ts](apps/web/e2e/bucket-message-edit-admin-without-permission.spec.ts) and [bucket-message-edit-non-admin.spec.ts](apps/web/e2e/bucket-message-edit-non-admin.spec.ts): ensure they navigate to edit using a **real message id** from seed or from a prior create step, not a fabricated UUID. If they use invalid id, add a test that uses a real message id and asserts not-found or forbidden.

**Verification:** Run affected web specs; optionally loosen permission in app and confirm tests fail (negative check).

---

## Management-web: Deny tests and events own-only

**Issue:** "Management deny-path tests rely on fabricated IDs"; "Management events own-only behavior not strongly verified."

**Fix:**

- **Deny paths:** In bucket-admin-edit or bucket-message-edit limited-admin / no-permission specs, use real seeded bucket and admin/message IDs where applicable; assert redirect or not-found after navigation.
- **Events own-only:** In [events-limited-admin-no-buckets-events-own-only.spec.ts](apps/management-web/e2e/events-limited-admin-no-buckets-events-own-only.spec.ts), add or strengthen assertions that the events table shows only events the limited admin is allowed to see (e.g. by actor/target from seed), and that rows for other actors are absent when seed would allow them.

**Verification:** `make e2e_test_management_web_report_spec SPEC=e2e/events-limited-admin-no-buckets-events-own-only.spec.ts` and any modified deny-path specs.
