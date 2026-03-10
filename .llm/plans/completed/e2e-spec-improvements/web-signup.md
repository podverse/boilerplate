# E2E improvement: Web Signup

## Spec path

- **Web:** `apps/web/e2e/signup.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: N/A (auth only)
- Alignment status: N/A
- Brief: Validation and success path should be covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (signup-page).
- **Permission actor matrix:** N/A.
- **AuthZ matrix:** Already logged in visits signup → redirect to dashboard or home (if applicable).
- **CRUD state matrix:** Create (signup): valid submit → redirect to login or dashboard and user can log in; validation (duplicate email, weak password, invalid email) → error visible, remain on form.
- **URL state:** N/A.
- **Flows:** Visit signup → submit invalid → validation; submit valid → success.

## Steps to implement

1. Add test: signup form visible for unauthenticated user.
2. Add test: submit with invalid data (duplicate email, weak password, invalid email) → validation messages visible, remain on signup.
3. Add test: submit valid data → success (redirect to login or dashboard); optionally assert user can log in.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/signup.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: signup form visible (unauthenticated); duplicate-email validation; invalid-email validation (invalid@email); weak-password → submit disabled; valid signup → redirect to login/dashboard or admin-only message; log-in link → login page; empty form → submit disabled. setE2EUserContext and hyphenated signup-page throughout. Targeted spec passes (7/7).
