# E2E improvement: Management-web Profile

## Spec path

- **Web:** N/A (see web-profile.md)
- **Management-web:** `apps/management-web/e2e/profile.spec.ts`

## Current state

- Permission-gated: Yes (authenticated, self)
- Alignment status: Partial
- Brief: Unauthenticated redirect; self-only.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; authenticated → profile visible (self-only).
- **AuthZ matrix:** N/A (self page).
- **CRUD state matrix:** Read profile; Update if form exists (save, persistence, validation).
- **URL state:** N/A.
- **Flows:** Nav → profile.

## Steps to implement

1. Add test: unauthenticated → redirect to login.
2. Add test: authenticated user opens profile → profile content visible; save changes if applicable → persist.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/profile.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, authenticated opens profile→redirect to settings then profile-tab content visible (display name, update button), save profile (display name)→success message and value persists. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Profile lives on settings-page profile tab (self-only).
