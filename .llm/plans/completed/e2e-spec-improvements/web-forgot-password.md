# E2E improvement: Web Forgot password

## Spec path

- **Web:** `apps/web/e2e/forgot-password.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: N/A (auth only)
- Alignment status: N/A
- Brief: Validation and success path.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (forgot-password-page).
- **Permission actor matrix:** N/A.
- **AuthZ matrix:** N/A.
- **CRUD state matrix:** Submit with valid email → success message or redirect; submit with invalid/empty email → validation visible.
- **URL state:** N/A.
- **Flows:** Visit forgot-password → submit → success or validation.

## Steps to implement

1. Add test: forgot-password form visible.
2. Add test: submit with invalid or empty email → validation visible.
3. Add test: submit with valid email → success message or redirect (per product; do not assert email delivery in E2E).
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/forgot-password.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: forgot-password form visible (unauthenticated); submit with empty email → validation visible, remain on forgot-password-page; submit with invalid email format (invalid@email) → validation visible; submit with valid email (e2e@example.com) → success message (Check your email / If an account exists); log-in link → login-page. setE2EUserContext and hyphenated forgot-password-page throughout. Targeted spec passes (5/5).
