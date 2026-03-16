# E2E improvement: Web Settings

## Spec path

- **Web:** `apps/web/e2e/settings.spec.ts`
- **Management-web:** N/A (see mgmt-settings.md)

## Current state

- Permission-gated: Yes (authenticated, self)
- Alignment status: Partial
- Brief: Unauthenticated redirect; self-only behavior.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; authenticated → settings page visible (self-only).
- **AuthZ matrix:** Self-only page; no cross-user settings.
- **CRUD state matrix:** Read settings; Update if forms exist (e.g. password, email) with persistence and validation.
- **URL state:** N/A unless settings has tabs.
- **Flows:** Dashboard/nav → settings.

## Steps to implement

1. Add test: unauthenticated → redirect to login.
2. Add test: authenticated user opens settings → settings content visible; any save flows with persistence assertion.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/settings.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (self-only; authenticated sees own settings). Unauthenticated→redirect; authenticated opens settings→URL and tabs/heading in callback, capturePageLoad; password-tab mismatch→validation in callback, capturePageLoad; email-tab→URL and new-email control in callback, capturePageLoad; profile-tab save→display name update, success message and persisted name in callback, capturePageLoad; setE2EUserContext and hyphenated terms (user-settings-page, settings-page, profile-tab, password-tab, email-tab). Run `make e2e_test_web_report_spec SPEC=e2e/settings.spec.ts` locally to verify (Xcode license may block in CI).
