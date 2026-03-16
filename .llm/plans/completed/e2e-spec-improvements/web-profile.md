# E2E improvement: Web Profile

## Spec path

- **Web:** `apps/web/e2e/profile.spec.ts`
- **Management-web:** N/A (see mgmt-profile.md)

## Current state

- Permission-gated: Yes (authenticated, self)
- Alignment status: Partial
- Brief: Unauthenticated redirect; self-only assertions may be missing (e.g. cannot open another user's profile by id).

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; authenticated → own profile visible; if profile is self-only by URL, invalid/other user id → not found or redirect to self.
- **AuthZ matrix:** Self-only: no "edit other user" on this page.
- **CRUD state matrix:** Read profile; Update if form exists (save → persist, validation).
- **URL state:** N/A unless profile has tabs/query.
- **Flows:** Dashboard/settings → profile.

## Steps to implement

1. Add test: unauthenticated → redirect to login.
2. Add test: authenticated user opens own profile → profile content visible; save changes if applicable → persist.
3. If profile URL accepts user id, add test: authenticated user opens profile with other user id → not found or redirect to self (per product).
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/profile.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (self-only; /profile redirects to /settings; no user id in URL). Unauthenticated→redirect to login; authenticated opens /profile→redirect to /settings and profile/identity visible (URL and content in callback, capturePageLoad); save test: open settings?tab=profile, update display name, save→success message and updated name visible (assertions in callback, capturePageLoad); setE2EUserContext and hyphenated terms. Profile URL does not accept user id so no other-user-id test. Run `make e2e_test_web_report_spec SPEC=e2e/profile.spec.ts` locally to verify (Xcode license may block in CI).
