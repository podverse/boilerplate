# Bucket-only recursive routing - summary

**Completed:** 2026-03-05. All phases (01–09) implemented. Flat URL strategy: private `/bucket/[id]` and public `/b/[id]`; topic routes removed; root-scoped governance and descendant name-only updates enforced; OpenAPI, i18n, docs, and integration tests updated.

## Scope

Hard-cut rewrite to remove topic semantics and support recursive bucket nesting in URLs:

- Private: `bucket/<id>/bucket/<id>/...`
- Public: `b/<id>/b/<id>/...`

Governance is root-scoped:

- Owner/admins/settings are only defined on the top-level bucket.
- Descendants inherit governance transitively.
- Descendant buckets can only update `name`.

## Plan files

- `01-inheritance-governance-foundation.md`
- `02-recursive-routing-model.md`
- `03-web-hard-cut-routes-and-pages.md`
- `04-management-web-hard-cut.md`
- `05-api-contracts-and-guards.md`
- `06-orm-sql-and-data-model.md`
- `07-client-helpers-and-types.md`
- `08-i18n-docs-terminology.md`
- `09-openapi-tests-cutover.md`

## Critical decisions

- Hard cut: no redirects/aliases for `/topic` or `/t`.
- Full-stack rename/removal of topic semantics where externally exposed.
- Single coordinated release across web, api, management-web, management-api.

## Dependency map

1. Governance/effective-root model first.
2. Recursive route helper model second.
3. Web + management-web routing/pages.
4. API contracts/guards.
5. ORM/SQL naming convergence.
6. Helper packages and i18n/docs.
7. OpenAPI + tests + cutover checks.
