# Short bucket IDs

**Started:** 2026-03-02  
**Context:** Plan: add short, URL-safe id (e.g. 10 chars) for buckets; use in all user-facing URLs instead of 36-char UUID; keep UUID as internal primary key.

---

### Session 1 - 2026-03-02

#### Prompt (Developer)
Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- short_id in CREATE TABLE: added to 0003_bucket_schema.sql (and combined init); no separate migration 0004.
- App sets short_id on insert (nanoid); no backfill migration.
- ORM: nanoid customAlphabet 10 chars (URL-safe); BucketService.create retries on unique violation (23505) up to 5 times.
- API: all bucket resolution from path params (id, bucketId) use `findByShortId`; internal calls (update, delete, findChildren, findByBucketId, etc.) use `bucket.id` (UUID).
- Web: use `bucket.shortId` in all bucket links (bucketDetailRoute, bucketEditRoute, publicBucketRoute); topic links use `topic.shortId`. URL param remains `[id]` but value is shortId.
- helpers-requests: Bucket and PublicBucket types include `shortId`.

#### Files Created/Modified
- infra/database/migrations/0003_bucket_schema.sql (short_id in CREATE TABLE + idx_bucket_short_id)
- infra/database/combined/init_database.sql (bucket table already had short_id; matches 0003)
- packages/orm: entities/Bucket.ts (shortId column), services/BucketService.ts (findByShortId, create with nanoid + retry)
- apps/api: bucketsController.ts, bucketAdminsController.ts, bucketMessagesController.ts (resolve by shortId, use bucket.id internally)
- packages/helpers-requests: types/bucket-types.ts (shortId on Bucket, PublicBucket)
- apps/web: buckets/page.tsx, buckets/[id]/page.tsx, buckets/[id]/admins/page.tsx (shortId in types, use shortId in route helpers)

### Session 2 - 2026-03-03

#### Prompt (Developer)
404 not found when i visit http://localhost:4002/buckets/DkKipVUEqC/admins even tho i have confirmed http://localhost:4002/buckets/DkKipVUEqC loads

#### Key Decisions
- Bucket admins page was using a local `fetchBucket` that treated API response `res.data` as the bucket object; the API returns `{ bucket }`, so `res.data.id` was always undefined and the page always called `notFound()` (404). Fixed by using the shared `fetchBucket` from `lib/buckets`, which correctly reads `res.data.bucket`.

#### Files Created/Modified
- apps/web/src/app/(main)/buckets/[id]/admins/page.tsx (use fetchBucket from lib/buckets; remove duplicate Bucket type and local fetchBucket)
