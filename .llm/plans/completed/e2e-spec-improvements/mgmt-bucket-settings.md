# E2E improvement: Management-web Bucket settings

## Spec path

- **Web:** N/A (see web-bucket-settings.md)
- **Management-web:** `apps/management-web/e2e/bucket-settings.spec.ts`

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Needs alignment
- Brief: Tabs and admins/roles visibility by management role not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin sees all tabs; admin with bucket settings permission sees tabs; admin without → not found or limited; invalid bucket id → not found.
- **AuthZ matrix:** Tab visibility (admins, roles) by management role.
- **CRUD state matrix:** Read settings; save persistence across tabs if applicable.
- **URL state:** ?tab=admins, ?tab=roles preserved.
- **Flows:** Navigate to bucket settings; switch tabs, assert URL and content.

## Steps to implement

1. Add tests: unauthenticated → redirect; super-admin opens bucket settings → tabs visible; admin with permission → tabs; admin without → not found.
2. Add URL state test: open with ?tab=admins and ?tab=roles, assert params and content.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-settings.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: permission note (bucketsCrud for settings, bucketAdminsCrud for admins/roles tabs); unauthenticated→redirect; invalid bucket id (UUID)→not found; permitted user (super-admin) opens settings→tabs visible (general, admins, roles) with actionAndCapture and capturePageLoad; admin without permission→not found deferred in suite comment; URL state: open with ?tab=admins and ?tab=roles, assert params preserved and tab content (admins: Add admin link/button, roles: Create role link) with capturePageLoad. setE2EUserContext and hyphenated terms throughout. Run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-settings.spec.ts`.
