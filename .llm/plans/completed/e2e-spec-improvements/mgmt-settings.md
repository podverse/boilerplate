# E2E improvement: Management-web Settings

## Spec path

- **Web:** N/A (see web-settings.md)
- **Management-web:** `apps/management-web/e2e/settings.spec.ts`

## Current state

- Permission-gated: Yes (authenticated)
- Alignment status: Partial
- Brief: Unauthenticated redirect.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; authenticated → settings visible.
- **AuthZ matrix:** N/A (self page).
- **CRUD state matrix:** Read settings; Update if forms exist.
- **URL state:** N/A.
- **Flows:** Nav → settings.

## Steps to implement

1. Add test: unauthenticated → redirect to login.
2. Add test: authenticated user opens settings → settings content visible.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/settings.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, authenticated opens settings→settings content visible (heading and General, Profile, Password tabs), password-tab form visible. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Self-only page.
