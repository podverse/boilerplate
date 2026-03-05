import type { Bucket } from '@boilerplate/orm';

export type BucketJson = {
  id: string;
  shortId: string;
  ownerId: string;
  ownerDisplayName?: string | null;
  name: string;
  isPublic: boolean;
  parentBucketId: string | null;
  messageBodyMaxLength: number | null;
  createdAt: string;
  updatedAt: string;
};

/** Shape bucket for management API responses. */
export function bucketToJson(bucket: Bucket, ownerDisplayName?: string | null): BucketJson {
  return {
    id: bucket.id,
    shortId: bucket.shortId,
    ownerId: bucket.ownerId,
    ...(ownerDisplayName !== undefined && { ownerDisplayName }),
    name: bucket.name,
    isPublic: bucket.isPublic,
    parentBucketId: bucket.parentBucketId,
    messageBodyMaxLength: bucket.settings?.messageBodyMaxLength ?? null,
    createdAt: bucket.createdAt.toISOString(),
    updatedAt: bucket.updatedAt.toISOString(),
  };
}
