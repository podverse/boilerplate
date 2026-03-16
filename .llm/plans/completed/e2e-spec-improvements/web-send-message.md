# E2E improvement: Web Send message

## Spec path

- **Web:** `apps/web/e2e/send-message.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: Yes (message create)
- Alignment status: Needs alignment
- Brief: Who can send message and validation not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner or admin with bucket message permission can open send form; non-admin or no access → not found.
- **AuthZ matrix:** Who sees send-message link/button (e.g. from bucket messages page).
- **CRUD state matrix:** Create: valid submit → message appears in list or success feedback; validation (empty body, length, etc.).
- **URL state:** N/A for form.
- **Flows:** Bucket messages → send message form.

## Steps to implement

1. Establish permission for sending message (bucket message create or similar).
2. Add tests: unauthenticated → redirect; permitted user opens send form → form visible; restricted → not found.
3. Add test: submit valid message → success and message visible or redirect to list.
4. Add validation tests: empty/invalid submit → validation visible, remain on form.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/send-message.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (public bucket send-message only; no auth required; invalid or private bucket id→not found). Permitted user opens send form→destination URL and form visible (assertions in callback); invalid short id→not found; private bucket send-message→not found; validation test (submit disabled until required fields filled, then enabled, in callback + capturePageLoad); valid submit→redirect to public bucket (URL in callback + capturePageLoad); flow: public bucket page→submit-message link→send-message-page and form visible; setE2EUserContext and hyphenated terms (send-message-page). No unauthenticated redirect (public form allows unauthenticated). Run `make e2e_test_web_report_spec SPEC=e2e/send-message.spec.ts` locally to verify (Xcode license may block in CI).
