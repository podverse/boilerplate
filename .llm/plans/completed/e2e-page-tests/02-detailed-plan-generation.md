# E2E Page Tests – Detailed Plan Generation

## Purpose

Before implementing or revising any page-level E2E spec, refine the dedicated
detailed plan for that page in `.llm/plans/completed/e2e-page-tests`. The
existing `web-*.md` and `mgmt-*.md` files are already the canonical detailed
plans; this document describes how to update them, not how to create a second
parallel layer of `detail-*` files.

## Input

- One current detailed plan file from
  `.llm/plans/completed/e2e-page-tests` (`web-*.md` or `mgmt-*.md`)
- Current route/page implementation under `apps/*/src/app/**/page.tsx`
- Related components and route helpers
- Deterministic seed/token/isolation assumptions from `docs/testing/E2E-PAGE-TESTING.md`

## Required output sections (per page detailed plan revision)

1. Route + objective
2. Selector strategy (stable selectors; avoid brittle text-only checks)
3. Assertion matrix:
   - Layout structure
   - Deterministic values
   - Interaction behavior
   - Redirect/auth/permission branches
   - Empty/loading/error states
4. CRUD matrix (if applicable):
   - Create/read/update/delete
   - Validation failures
   - Cancel/confirm branches
   - Idempotency (double-submit protection)
5. Test data mapping (exact seeded entities/IDs and when to create helper/temp fixtures)
6. Screenshot and trace checkpoints
7. Verification commands and expected artifacts
8. Report-mode notes when QA visual review needs explicit step screenshots

## Quality bar for detailed plans

- Must be executable without additional product-guessing.
- Must specify what is asserted and why, not only navigation steps.
- Must include negative-path cases that could regress silently.
- Must identify permission-scoped differences for management-web pages.
- Must avoid unstated fixture assumptions; if the default seed does not provide a
  needed child bucket, scoped admin, or token, say how the test obtains it.
- Must keep report-mode expectations aligned with the shared runbook instead of
  inventing ad hoc artifact paths per page.

## File handling

- Update the existing `web-*.md` / `mgmt-*.md` file in place under
  `.llm/plans/completed/e2e-page-tests`.
- Do not create `detail-web-*` or `detail-mgmt-*` shadow files.
- Keep each detailed plan under 300 lines. If a page starts growing too large,
  move truly cross-cutting guidance back into shared docs instead of creating a
  second per-page detail layer.
