import type { Bucket } from '@boilerplate/orm';

/** Shape bucket for GET /buckets/:id and list; keeps messageBodyMaxLength at top level from settings. */
export function toBucketResponse(bucket: Bucket): {
  id: string;
  shortId: string;
  ownerId: string;
  name: string;
  isPublic: boolean;
  parentBucketId: string | null;
  messageBodyMaxLength: number | null;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: bucket.id,
    shortId: bucket.shortId,
    ownerId: bucket.ownerId,
    name: bucket.name,
    isPublic: bucket.isPublic,
    parentBucketId: bucket.parentBucketId,
    messageBodyMaxLength: bucket.settings?.messageBodyMaxLength ?? null,
    createdAt: bucket.createdAt,
    updatedAt: bucket.updatedAt,
  };
}

/** Shape bucket for public GET /buckets/public/:id. */
export function toPublicBucketResponse(bucket: Bucket): {
  id: string;
  shortId: string;
  name: string;
  isPublic: boolean;
  messageBodyMaxLength: number | null;
} {
  return {
    id: bucket.id,
    shortId: bucket.shortId,
    name: bucket.name,
    isPublic: bucket.isPublic,
    messageBodyMaxLength: bucket.settings?.messageBodyMaxLength ?? null,
  };
}
