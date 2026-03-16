# E2E improvement: Web Reset password

## Spec path

- **Web:** `apps/web/e2e/reset-password.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: N/A (auth only, token-gated)
- Alignment status: N/A
- Brief: Token invalid/valid and success path.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (reset-password-page).
- **Permission actor matrix:** N/A.
- **AuthZ matrix:** N/A.
- **CRUD state matrix:** Valid token → form visible; submit valid new password → success (redirect to login); invalid/expired token → error or not found; validation (weak password, mismatch) → error visible.
- **URL state:** Token in URL; assert consumed or preserved per product.
- **Flows:** Open reset link with valid token → form; submit → success; open with invalid token → error.

## Steps to implement

1. Add test: reset link with valid token → form visible.
2. Add test: reset link with invalid/expired token → error message or not found.
3. Add test: submit valid new password → success (redirect to login or dashboard).
4. Add test: submit invalid (weak password, password mismatch) → validation visible.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/reset-password.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** E2E seed inserts fixed `password_reset` token (32-char raw, sha256 hash) for E2E user; `resetPasswordToken.ts` exports same raw token. Spec: six tests with setE2EUserContext and hyphenated reset-password-page—(1) valid token → form visible, (2) invalid token → error visible, (3) valid submit → redirect to /login, (4) weak password → validation, (5) password mismatch → single-element text assertion, (6) log-in link → /login. Run: `make e2e_test_web_report_spec SPEC=e2e/reset-password.spec.ts`.
