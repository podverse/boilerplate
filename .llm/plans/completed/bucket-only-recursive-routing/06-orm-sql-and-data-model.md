# 06 - ORM, SQL, and data model convergence

## Scope

Converge naming/model so topic semantics are removed while preserving recursive parent-child buckets.

## Steps

1. Remove topic terminology from entities/services/comments where still present.
2. Apply required full-stack renames for externally exposed contract terms.
3. Update migrations and combined init SQL in lockstep.
4. Ensure root-governance model does not duplicate descendant governance data.

## Key files

- `packages/orm/src/entities/Bucket.ts`
- `packages/orm/src/services/BucketService.ts`
- `infra/database/migrations/0003_bucket_schema.sql`
- `infra/database/combined/init_database.sql`
- `infra/management-database/combined/init_management_database.sql`

## Verification

- ORM queries still support deep hierarchy traversal.
- Fresh DB init and migration path produce identical schema for affected objects.
