# E2E improvement: Web Short bucket (short URL resolve)

## Spec path

- **Web:** `apps/web/e2e/short-bucket.spec.ts`
- **Management-web:** N/A

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Partial
- Brief: Short URL resolve; by-actor behavior (who can resolve, who gets not found) may be missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect or public resolve? Owner/admin → resolve to bucket detail; non-admin with no access → not found or redirect?
- **AuthZ matrix:** N/A (resolve is single action).
- **CRUD state matrix:** Read (resolve to detail); invalid short id → not found.
- **URL state:** Short URL → redirect to canonical bucket URL.
- **Flows:** Visit short URL → land on bucket detail (or login then detail).

## Steps to implement

1. Define behavior: does short URL require auth or resolve for unauthenticated?
2. Add tests: unauthenticated visit short URL → redirect to login or to detail per product; owner/admin visit → resolve to bucket detail; invalid short id → not found; non-admin visit valid short id for bucket they cannot access → not found or forbidden.
3. Assert destination URL and destination page content after resolve.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/short-bucket.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Behavior comment: /b/{id} is public bucket page, no auth; public→content, private/invalid→not found. Unauthenticated and authenticated visit public short URL→destination URL and bucket name (assertions in callbacks); send-message link test with URL and content in callback; invalid short id→not found; private short URL→not found (app returns notFound()); setE2EUserContext and hyphenated terms (short-bucket-page); capturePageLoad after resolve tests. Run `make e2e_test_web_report_spec SPEC=e2e/short-bucket.spec.ts` locally to verify (Xcode license may block in CI).
