# Bucket owner and admins

How the boilerplate treats the **owner** of a bucket vs **bucket admins**, and how CRUD is enforced.

## Owner

- **Full CRUD**: The owner always has full CRUD on the bucket and its messages. This is enforced in **`apps/api/src/lib/bucket-policy.ts`**: every `can*` function returns `true` when `bucket.ownerId === userId`. Admins get access only per their `bucket_crud` and `message_crud` bitmasks.
- **Cannot be edited or removed**: The owner’s abilities are not removable. In **`apps/api/src/controllers/bucketAdminsController.ts`**:
  - **PATCH** (update admin): returns `403` with "Bucket owner cannot be edited" if the target user is the owner.
  - **DELETE** (remove admin): returns `403` with "Bucket owner cannot be removed" if the target user is the owner.
- **UI**: In **`packages/ui`** `BucketAdminsView`, the owner row shows an "Owner" label and **no** Edit/Delete buttons (`a.userId === ownerId`). Only non-owner admins get CRUD actions.

## Admins

- **Selective CRUD**: Bucket admins have permissions stored per row: `bucket_crud`, `message_crud`, and optionally `admin_crud` (for managing other admins). These are bitmasks (create/read/update/delete). Only the owner has implicit full access; admins are limited to what’s set on their row.
- **Editable/removable**: Non-owner admins can be updated (permissions changed) or removed by users who have "manage bucket admins" (owner or admin with bucket update).

## Summary

| Role  | Bucket/message CRUD                | Editable/removable in Settings       |
| ----- | ---------------------------------- | ------------------------------------ |
| Owner | Full (always)                      | No (row is display-only)             |
| Admin | Per `bucket_crud` / `message_crud` | Yes (by users who can manage admins) |
