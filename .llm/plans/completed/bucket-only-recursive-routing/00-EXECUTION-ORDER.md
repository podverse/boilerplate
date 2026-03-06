# Bucket-only recursive routing - execution order

## Phase 1 (sequential)

1. `01` - Inheritance/governance foundation in effective-bucket and policy layers.
2. `02` - Recursive routing model and shared helper API for path generation/parsing.

## Phase 2 (parallel after Phase 1)

3. `03` - Web hard-cut routes/pages/components.
4. `04` - Management-web hard-cut routes/pages/components.

Wait for both 03 and 04 to finish.

## Phase 3 (sequential)

5. `05` - API + management-api contract rewrite and mutation guardrails.
6. `06` - ORM/SQL naming and model convergence.
7. `07` - helpers-requests and shared client type updates.

## Phase 4 (parallel where possible)

8. `08` - i18n/docs terminology sweep.
9. `09` - OpenAPI and integration/e2e test rewrite.

## Completion gate

- All old topic URL patterns removed.
- Recursive bucket URLs function for depth >= 3 (private/public).
- Descendant buckets reject owner/admin/settings changes and allow name-only edits.
