# 03 – Settings and invite auth E2E (all modes)

**Purpose:** Ensure auth-related **settings** (profile, password, email tabs) and **invite** flows are covered across modes. Change password, request email change (when applicable), invite accept/reject and login-required; no regressions.

**Prerequisite:** 00 completed. Settings and invite specs are part of the **baseline** spec list (e2e-spec-order-web.txt); they run with default config (admin_only_username). Admin_only_email and user_signup_email do not have separate settings/invite spec files; behavior is either shared or can be asserted in a single run if we add mode-specific settings/invite specs later.

---

## Existing baseline coverage

**Settings (from e2e-spec-order-web.txt):**

| Spec | Coverage |
|------|----------|
| `e2e/settings-unauthenticated.spec.ts` | Unauthenticated → redirect to login |
| `e2e/settings-non-admin.spec.ts` | Non-admin sees settings (tabs/heading) |
| `e2e/settings-bucket-owner.spec.ts` | Bucket owner: profile/password/email tabs, URL preserves tab param, profile save, password mismatch validation, email tab new-email form, admins-tab owner row no delete, generate invitation link, remove pending invitation, general tab edit/cancel |

**Invite (from e2e-spec-order-web.txt):**

| Spec | Coverage |
|------|----------|
| `e2e/invite-unauthenticated.spec.ts` | Invalid/expired token → stable error; valid token → invite content + login-required flow; login with empty credentials → validation/error |
| `e2e/invite-non-admin.spec.ts` | Invalid token → invalid state; valid token → accept/reject actions |
| `e2e/invite-bucket-owner.spec.ts` | Same (invalid/valid token) |
| `e2e/invite-bucket-admin.spec.ts` | Same |

All of the above run with **admin_only_username** only (baseline). They cover the main flows; mode-specific differences (e.g. email tab only when auth uses email) are implicit in the app—bucket-owner and non-admin users in the seed may have email or username depending on mode; the same specs still load settings and invite pages.

---

## Steps to execute

1. **Confirm baseline settings and invite specs are in e2e-spec-order-web.txt**  
   **Done.** Confirmed present: settings-unauthenticated, settings-non-admin, settings-bucket-owner (lines 19–21); invite-unauthenticated, invite-non-admin, invite-bucket-owner, invite-bucket-admin (lines 82–85).

2. **Run baseline E2E (includes settings + invite):**  
   `make e2e_test_web`  
   First phase runs all baseline specs, including settings and invite. **Skipped during implementation.** Run the command to verify no failures.

3. **If any settings spec fails:**  
   - Profile tab: display name update, save, success feedback.  
   - Password tab: mismatch → validation; tab param in URL.  
   - Email tab: new-email form visible (when user has email in admin_only_email/user_signup_email; in admin_only_username seed users may still have email). Adjust selectors if labels changed.  
   - Invitation: generate link, remove pending; admins-tab assertions.

4. **Optional: mode-specific settings/invite**  
   If we need explicit admin_only_email or user_signup_email settings/invite coverage (e.g. email tab visibility by mode, or invite flow with email-based user), add one spec per mode and run them with the corresponding Playwright config; add those spec files to the appropriate order file (admin-only-email or signup-enabled list). For this plan, baseline coverage is sufficient unless you want explicit mode matrix.

---

## Deliverables

- [x] Baseline settings and invite specs confirmed in e2e-spec-order-web.txt; pass as part of `make e2e_test_web` (first phase) when run (test run skipped during implementation).
- [x] No regressions expected: profile save, password validation, email tab, invite generate/remove, invite accept/reject and login-required flow.
- [x] Optional: add settings or invite specs for admin_only_email / user_signup_email — not done; baseline coverage sufficient per plan.

**Completion note:** Implementation completed 2026-03-11. Step 1 confirmed. Step 2 (run E2E) skipped per request; run `make e2e_test_web` to verify baseline settings and invite specs pass.
