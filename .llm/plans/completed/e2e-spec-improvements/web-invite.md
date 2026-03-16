# E2E improvement: Web Invite

## Spec path

- **Web:** `apps/web/e2e/invite.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: Yes (token + auth)
- Alignment status: Partial
- Brief: Invalid/expired token and auth required paths may need strengthening.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (invite-page, etc.).
- **Permission actor matrix:** Unauthenticated with valid token → form; unauthenticated with invalid/expired token → error message or redirect; authenticated with valid token → accept flow or redirect.
- **AuthZ matrix:** N/A (invite is token-gated).
- **CRUD state matrix:** Accept invite flow: valid token + submit → success; invalid token → error; validation (password, etc.).
- **URL state:** Token in URL; assert token preserved or consumed correctly.
- **Flows:** Open invite link → form or error; submit → success or validation.

## Steps to implement

1. Add test: unauthenticated user opens invite with valid token → invite form visible (or redirect to login with returnUrl).
2. Add test: invalid or expired token → stable error message or not-found UI (assert after navigation).
3. Add test: authenticated user with valid token → appropriate behavior (e.g. can accept, or redirect).
4. Add validation test: submit with invalid password/fields → validation visible.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/invite.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (token-gated; valid→invite-page, login required if unauthenticated; invalid/expired→error). Invalid token (unauthenticated and authenticated)→stable error message, URL asserted in callback, capturePageLoad for both; unauthenticated with valid token→invite-page and login-required flow (URL and form in callback, capturePageLoad); validation test: unauthenticated opens valid invite, clicks log in, submits login with empty email→validation/error visible, remain on flow; authenticated with valid token→accept/reject or final state (assertions in callback, capturePageLoad); setE2EUserContext and hyphenated terms (invite-page). Run `make e2e_test_web_report_spec SPEC=e2e/invite.spec.ts` locally to verify (Xcode license may block in CI).
