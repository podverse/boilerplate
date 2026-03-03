# 02 – Permissions and policy

**Scope:** Who can do what; how to compute “can create/read/update/delete bucket” and “can create/read/update/delete message”.

## Rules

### Owner

- User who created the bucket.
- Full CRUD on bucket and messages.
- Can assign/remove bucket admins and set their `bucket_crud` and `message_crud`.

### Bucket admin

- User in `bucket_admin` for that bucket.
- Capabilities only as specified by `bucket_crud` and `message_crud`.
- Use CRUD_BITS: create=1, read=2, update=4, delete=8 (`packages/helpers/src/crud/crud-bitmask.ts`).

### Bucket visibility (`bucket.is_public`)

- **True:** Anyone can open the public bucket page; which messages they see depends on each message’s `is_public`.
- **False:** Only owner and bucket admins (with read) can see the bucket and its messages in the app; public page returns 404 or 403.

### Message visibility (`message.is_public`)

- **True:** Shown to anyone viewing the bucket’s public page (when bucket is public) and to owner/admins in the app.
- **False:** Only owner and bucket admins (with read) can see it.

## Policy helpers

Centralize in one place (e.g. `packages/orm` or `apps/api`):

- `canReadBucket(userId, bucket)`
- `canUpdateBucket(userId, bucket)`
- `canDeleteBucket(userId, bucket)`
- `canCreateBucket(userId, parentBucket)` (for creating child topics)
- `canReadMessage(userId, bucket, message)`
- `canCreateMessage(userId, bucket)`
- `canUpdateMessage(userId, bucket, message)`
- `canDeleteMessage(userId, bucket, message)`
- `canManageBucketAdmins(userId, bucket)`

Use owner check and `BucketAdminService` + bitmask checks. These are used by the API and (via API or shared types) by the web app.

## Verification

- Document matrix: owner / admin with R / admin without R / anonymous for bucket and message read.
- Tests that enforce 403/404 for disallowed access.
