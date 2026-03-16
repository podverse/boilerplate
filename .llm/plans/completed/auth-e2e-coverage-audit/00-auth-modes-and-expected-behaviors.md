# Auth modes and expected behaviors (web)

**Source:** [apps/web/src/lib/authMode.ts](apps/web/src/lib/authMode.ts). The three modes drive `canPublicSignup`, `canUseEmailVerificationFlows`, `canIssueAdminInviteLink`, and `requiresEmailAtInviteCompletion`.

---

## 1. admin_only_username (baseline)

| Capability | Value |
|------------|--------|
| canPublicSignup | false |
| canUseEmailVerificationFlows | false |
| canIssueAdminInviteLink | true |
| requiresEmailAtInviteCompletion | false |

**Expected behavior by page:**

| Page | Expected behavior | E2E covered |
|------|-------------------|--------------|
| Login | Username + password; no signup link. | Yes (login-unauthenticated, login-bucket-owner). |
| Signup | Redirect to login. | Yes (signup-unauthenticated). |
| Forgot-password | Redirect to login. | Yes (forgot-password-unauthenticated). |
| Reset-password (with token) | Redirect to login. | Yes (reset-password-unauthenticated). |
| Verify-email (with token) | Redirect when email flows disabled. | Yes (verify-email-unauthenticated). |
| Confirm-email-change (with token) | Redirect when email flows disabled. | Yes (confirm-email-change-unauthenticated). |
| Set-password (invite) | Form with token + username (no email); valid token → login. | Yes (set-password-unauthenticated). |
| Settings | No “Change email” tab; tab=email redirects to /settings. | Yes (settings-bucket-owner). |
| Invite | Valid token → content + login required; accept/reject when logged in. | Yes (invite-* specs). |

---

## 2. admin_only_email

| Capability | Value |
|------------|--------|
| canPublicSignup | false |
| canUseEmailVerificationFlows | true |
| canIssueAdminInviteLink | true |
| requiresEmailAtInviteCompletion | true |

**Expected behavior by page:**

| Page | Expected behavior | E2E covered |
|------|-------------------|--------------|
| Login | Email + password; no signup link. | Yes (login-unauthenticated-admin-only-email). |
| Signup | Redirect to login. | Yes (signup-unauthenticated-admin-only-email). |
| Forgot-password | Form visible; valid email → “check your email”. | Yes (forgot-password-unauthenticated-admin-only-email). |
| Reset-password (with token) | Form visible; invalid token → error; valid token → success → login. | Yes (form, invalid token, valid token → login → revert in reset-password-unauthenticated-admin-only-email). |
| Set-password (invite) | Form with token + email; valid token → login. | Yes (set-password-unauthenticated-admin-only-email). |
| Settings | “Change email” tab visible; request email change → “verification email sent”. Confirm-email-change (link from email) has web page and E2E. | Yes (settings-bucket-owner-admin-only-email; confirm-email-change covered by confirm-email-change-admin-only-email.spec.ts). |
| Verify-email (with token) | No token / invalid → error; valid token → redirect. | Yes (verify-email-admin-only-email). |
| Confirm-email-change (with token) | No token / invalid → error; valid token → redirect. | Yes (confirm-email-change-admin-only-email). |
| Invite | Same as baseline (invite flow). | Baseline invite specs run; mode-specific invite spec optional. |

---

## 3. user_signup_email (signup-enabled)

| Capability | Value |
|------------|--------|
| canPublicSignup | true |
| canUseEmailVerificationFlows | true |
| canIssueAdminInviteLink | false |
| requiresEmailAtInviteCompletion | false |

**Expected behavior by page:**

| Page | Expected behavior | E2E covered |
|------|-------------------|--------------|
| Login | Email + password; signup and forgot-password links visible. | Yes (login-unauthenticated-signup-enabled). |
| Signup | Form visible; signup allowed. | Yes (signup-unauthenticated-signup-enabled). |
| Forgot-password | Form visible; valid email → “check your email”. | Yes (forgot-password-unauthenticated-signup-enabled). |
| Reset-password (with token) | Form visible; invalid/valid token behavior same as admin_only_email. | Yes (reset-password-unauthenticated-signup-enabled: form, invalid token, valid token → login → revert). |
| Set-password (invite) | Form with token (email or username per config); valid token → login. | Yes (set-password-unauthenticated-signup-enabled). |
| Verify-email (with token) | Same as admin_only_email. | No dedicated signup-enabled spec; admin_only_email coverage applies. |
| Confirm-email-change (with token) | Same as admin_only_email. | No dedicated signup-enabled spec; admin_only_email coverage applies. |
| Settings | “Change email” tab visible when email flows enabled (same as admin_only_email). | No dedicated signup-enabled settings spec; behavior same as admin_only_email for email tab. |
| Invite | Same as baseline. | Baseline invite specs. |

---

## Summary: gaps across all three modes

- **Reset-password with valid token:** E2E-covered in admin_only_email and user_signup_email (form, invalid token, valid token → login → revert).
- **Verify-email** and **Confirm-email-change:** Web pages exist; baseline redirect when email flows disabled; admin_only_email has full E2E (no token / invalid / valid token). user_signup_email has no dedicated verify/confirm specs; behavior mirrors admin_only_email.
- **user_signup_email settings email tab:** No dedicated E2E; behavior mirrors admin_only_email (same capability). Low risk; optional to add later.
