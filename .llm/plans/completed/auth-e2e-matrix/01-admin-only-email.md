# 01 – Admin-only-email auth E2E coverage

**Purpose:** Ensure full E2E coverage for `AUTH_MODE=admin_only_email`: login (signup hidden, forgot-password visible), signup redirect, forgot-password form, reset-password form, set-password form (email + username + password), invite. Fix any selector or assertion mismatches.

**Prerequisite:** 00-fix-and-baseline.md completed (default run uses baseline spec list only).

**Run these specs with:** `make e2e_test_web_admin_only_email` or `npm run test:e2e -w apps/web -- --config=playwright.admin-only-email.config.ts` plus the spec list from `makefiles/local/e2e-spec-order-web-admin-only-email.txt`. Config starts API/sidecar/web with `AUTH_MODE=admin_only_email` and mailer env (SMTP_HOST=localhost, etc.). Mailpit must be up for forgot-password flow if tests submit email.

---

## Existing spec files (admin_only_email)

| Spec | Coverage |
|------|----------|
| `e2e/login-unauthenticated-admin-only-email.spec.ts` | Login: signup link hidden, forgot-password link visible; click forgot-password → forgot-password page |
| `e2e/signup-unauthenticated-admin-only-email.spec.ts` | Signup: unauthenticated visits signup → redirect to login |
| `e2e/forgot-password-unauthenticated-admin-only-email.spec.ts` | Forgot-password form visible; submit valid email → check-your-email success |
| `e2e/reset-password-unauthenticated-admin-only-email.spec.ts` | Reset-password form (token, new password, confirm); invalid token → invalid-or-expired feedback |
| `e2e/set-password-unauthenticated-admin-only-email.spec.ts` | Set-password: email, username, password fields; submit without email → validation |

All five are listed in `e2e-spec-order-web-admin-only-email.txt`. No additional spec files required for baseline admin_only_email auth pages.

---

## Steps to execute

1. **Start Mailpit** (forgot-password tests that submit email): `make e2e_mailpit_up` before running admin_only_email E2E if the forgot-password spec submits an email and expects success (API sends to SMTP).

2. **Run admin_only_email E2E:**  
   `make e2e_test_web_admin_only_email`  
   Or manually: ensure test DBs and seed, then  
   `npm run test:e2e -w apps/web -- --config=playwright.admin-only-email.config.ts e2e/login-unauthenticated-admin-only-email.spec.ts e2e/signup-unauthenticated-admin-only-email.spec.ts e2e/forgot-password-unauthenticated-admin-only-email.spec.ts e2e/reset-password-unauthenticated-admin-only-email.spec.ts e2e/set-password-unauthenticated-admin-only-email.spec.ts`

3. **Fix selector/assertion mismatches if any test fails:**
   - **Login:** Forgot-password link: `getByRole('link', { name: /forgot password/i })`. If the app uses different text (e.g. "Forgot your password?"), broaden the regex or use a different selector.
   - **Forgot-password:** Submit button: `getByRole('button', { name: /send|submit|reset password|forgot|reset link/i })`. Align with the actual button label.
   - **Reset-password:** Token field: `getByLabel(/token|paste/i)`. If the reset form uses a different label (e.g. "Reset token"), update the spec to match.
   - **Set-password:** Email field: `getByLabel(/^email$/i)`. If the label is "Email address" or similar, use a regex that matches (e.g. `/email/i`). Email-required validation: `getByText(/email is required|required/i)`.

4. **Invite:** Invite flow is not mode-specific at the page level (invite page works for all modes). Baseline invite specs in `e2e-spec-order-web.txt` (invite-unauthenticated, invite-non-admin, invite-bucket-owner, invite-bucket-admin) run with default config only. To cover invite in admin_only_email, either add a single admin_only_email invite spec that opens invite with valid token and asserts accept/reject, or document that invite is covered by baseline + API; optional extra spec can be added here.

---

## Deliverables

- [x] All five admin_only_email auth specs pass when run with `playwright.admin-only-email.config.ts` (9 tests across 5 spec files).
- [x] Selectors aligned with app (no changes needed: forgot-password link /forgot password/i, forgot submit /send|submit|reset link/i, reset token /token|paste/i, set-password email /^email$/i, validation /email is required|required/i).
- [x] `e2e_test_web_admin_only_email` now depends on `e2e_mailpit_up` so forgot-password flow succeeds (API sends to Mailpit).
- [ ] Optional: add invite spec for admin_only_email if desired; otherwise leave as baseline-only.
