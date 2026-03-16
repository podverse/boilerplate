# 09 - OpenAPI, tests, and cutover validation

## Scope

Finalize hard cut with spec updates and coverage for recursive routing and inheritance constraints.

## Steps

1. Update OpenAPI route definitions and schemas to bucket-only recursive semantics.
2. Rewrite management-api integration tests for:
   - depth-3 nested bucket behavior
   - root-governance inheritance
   - descendant name-only mutation policy
3. Update web/management-web e2e tests to use new URL shapes.
4. Add explicit negative tests for old topic URLs (`/topic`, `/t`).

## Key files

- `apps/management-api/src/openapi.ts`
- `apps/management-api/src/test/management-buckets-messages.test.ts`
- `apps/web/e2e/dashboard.spec.ts`
- `apps/management-web/e2e/dashboard.spec.ts`

## Verification

- OpenAPI build/check passes.
- Integration tests and e2e tests pass on new routes only.
- No route helpers or tests reference `/topic` or `/t`.
