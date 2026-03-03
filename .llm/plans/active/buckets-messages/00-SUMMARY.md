# Buckets / Topics / Messages – Summary

## Scope

- **Users:** Main app users (create buckets, assign bucket admins, CRUD buckets/topics/messages) and anonymous submitters (POST messages to a bucket by slug, no login).
- **Resources:** Buckets (top-level), Topics (child buckets, one level only), Messages (per bucket), Bucket admins (per-bucket permissions).
- **Visibility:** Bucket-level (`is_public` → anyone can view public page or not); message-level (`is_public` → message visible on public page and to owner/admins).

## Naming

- **Bucket** = top-level container (e.g. a show). Table: `bucket`; `parent_bucket_id = null`.
- **Topic** = child of a bucket (e.g. an episode). Same table `bucket`; `parent_bucket_id` set to parent bucket id.
- **Bucket admin** = user assigned by bucket owner; has `bucket_crud` and `message_crud` bitmasks. Distinct from **management admin** (management-api/management-web).

## Plan files

| File                              | Purpose                                                |
| --------------------------------- | ------------------------------------------------------ |
| 00-EXECUTION-ORDER.md             | Phase order and pointers to numbered plans             |
| 01-data-model-and-migrations.md   | Entities, DB schema, migrations, ORM                   |
| 02-permissions-and-policy.md      | Owner vs bucket admin; CRUD; public visibility         |
| 03-api-endpoints.md               | API: buckets, topics, messages, public submit/read     |
| 04-web-app-buckets-ui.md          | apps/web: buckets/topics/admins UI                     |
| 05-web-app-messages-and-public.md | Messages UI; public bucket page; public submit form    |
| COPY-PASTA.md                     | Copy-paste prompts for parallel agents                 |

## Dependency map

- 01 (data model) → 02 (permissions) → 03 (API)
- 03 → 04 and 05 (web); 04 and 05 can be done in parallel after 03.

## Key decisions

- **Slug:** Unique per bucket/topic; used in public URLs and submit path; generated from name or provided at create; editable with uniqueness check.
- **Hierarchy:** One level only: Bucket → Topic (no deeper nesting).
- **CRUD bitmask:** `bucket_admin.bucket_crud` and `bucket_admin.message_crud` use create=1, read=2, update=4, delete=8 (see `packages/helpers` crud-bitmask).
- **Public submit:** Allowed when slug is known (bucket exists); decide in 02 whether to require `bucket.is_public` for submit or allow submit even when bucket is not public.
- **Rate limiting:** Public submit endpoint should be rate-limited (by IP or slug).
