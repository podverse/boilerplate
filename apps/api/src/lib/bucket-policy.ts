import { CRUD_BITS } from '@boilerplate/helpers';
import type { Bucket } from '@boilerplate/orm';
import type { BucketAdmin } from '@boilerplate/orm';
import type { BucketMessage } from '@boilerplate/orm';

/**
 * Bucket permission policy: owner has full CRUD; bucket admins have access per
 * bucket_crud and bucket_messages_crud bitmasks (create=1, read=2, update=4, delete=8).
 * Pass null for bucketAdmin when the user is not an admin for the bucket.
 */
export function canReadBucket(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.read) !== 0;
  return false;
}

/** Can create a child bucket under this bucket. Owner can; admin with create can. */
export function canCreateBucket(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.create) !== 0;
  return false;
}

export function canUpdateBucket(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.update) !== 0;
  return false;
}

export function canDeleteBucket(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.delete) !== 0;
  return false;
}

export function canReadMessage(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null,
  message: BucketMessage
): boolean {
  if (message.isPublic) return true;
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketMessagesCrud & CRUD_BITS.read) !== 0;
  return false;
}

export function canCreateMessage(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketMessagesCrud & CRUD_BITS.create) !== 0;
  return false;
}

export function canUpdateMessage(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null,
  _message: BucketMessage
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketMessagesCrud & CRUD_BITS.update) !== 0;
  return false;
}

export function canDeleteMessage(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null,
  _message: BucketMessage
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketMessagesCrud & CRUD_BITS.delete) !== 0;
  return false;
}

/** Owner can manage admins; bucket admin can if they have update on bucket. */
export function canManageBucketAdmins(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.update) !== 0;
  return false;
}

/** Owner can manage roles; bucket admin can if they have update on bucket. */
export function canManageBucketRoles(
  userId: string,
  bucket: Bucket,
  bucketAdmin: BucketAdmin | null
): boolean {
  if (bucket.ownerId === userId) return true;
  if (bucketAdmin !== null) return (bucketAdmin.bucketCrud & CRUD_BITS.update) !== 0;
  return false;
}
