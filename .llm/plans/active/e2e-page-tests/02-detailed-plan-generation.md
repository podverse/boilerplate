# E2E Page Tests – Detailed Plan Generation

## Purpose

Before implementing any page-level E2E spec, generate a dedicated detailed plan
for that page. Placeholder files are intentionally lightweight and not enough for
coding directly.

## Input

- One placeholder plan file (`web-*.md` or `mgmt-*.md`)
- Current route/page implementation under `apps/*/src/app/**/page.tsx`
- Related components and route helpers
- Deterministic seed data assumptions from `docs/testing/E2E-PAGE-TESTING.md`

## Required output sections (per page detailed plan)

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
5. Test data mapping (exact seeded entities/IDs and when to create temp fixtures)
6. Screenshot and trace checkpoints
7. Verification commands and expected artifacts

## Quality bar for detailed plans

- Must be executable without additional product-guessing.
- Must specify what is asserted and why, not only navigation steps.
- Must include negative-path cases that could regress silently.
- Must identify permission-scoped differences for management-web pages.

## File naming for detailed plans

Store generated detailed plans under this plan set using predictable names:

- `detail-web-<route-slug>.md`
- `detail-mgmt-<route-slug>.md`

Examples:

- `detail-web-bucket-id-settings-roles-new.md`
- `detail-mgmt-admins-roles-new.md`

Keep each detailed plan under 300 lines. If needed, split into `-part-01` and
`-part-02`.
