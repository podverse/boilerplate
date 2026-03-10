# 03 – Empty State and Invite Expired Token

## Gap 4: Deterministic empty-state test

**Issue:** Matrices list "Gap (deterministic empty/error/loading)". At least one explicit empty-list test improves confidence.

**Fix:**

- Add or extend one E2E test that forces an empty list and asserts the empty-state message (and primary CTA if present) is visible. Options:
  - **Web:** Buckets list with search term that matches no buckets (e.g. `?search=nomatchever123`), assert empty message and add-bucket link.
  - **Management-web:** Users or events list with search/filter that returns zero rows, assert empty message.
- Confirm at least one validation test exists per app (required-field or invalid submit → message visible, form remains). Management-web buckets-new and web have validation tests; verify and document.

**Verification:** Run the new or updated spec; run full suite for the app.

---

## Gap 5: Invite expired token

**Issue:** Matrix lists "Gap (expired token deterministic check)" for invite flow.

**Fix:**

- If the API or seed supports an expired invite token, add a test: navigate to `/invite/<expired-token>`, assert expired/invalid message and no accept/decline actions.
- If expired tokens are not easily producible in E2E seed, add a short comment in [apps/web/e2e/invite-seeded-bucket-owner.spec.ts](apps/web/e2e/invite-seeded-bucket-owner.spec.ts) or in the matrix that expired-token check is deferred until seed/API supports it.

**Verification:** If test added, run invite specs; otherwise no change to runs.
