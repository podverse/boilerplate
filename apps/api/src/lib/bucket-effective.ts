import type { Bucket } from '@boilerplate/orm';
import { BucketService } from '@boilerplate/orm';

export type BucketAndEffective = {
  bucket: Bucket;
  effectiveBucket: Bucket;
  effectiveSettings: Bucket['settings'];
};

/**
 * Resolve bucket by shortId or id. For topic buckets (parentBucketId != null),
 * effectiveBucket is the parent (used for permission and settings); otherwise
 * effectiveBucket is the bucket itself.
 */
export async function getBucketAndEffective(
  idOrShortId: string
): Promise<BucketAndEffective | null> {
  const bucket =
    (await BucketService.findByShortId(idOrShortId)) ?? (await BucketService.findById(idOrShortId));
  if (bucket === null) return null;
  if (bucket.parentBucketId !== null) {
    const parent = await BucketService.findById(bucket.parentBucketId);
    if (parent === null) return null;
    return {
      bucket,
      effectiveBucket: parent,
      effectiveSettings: parent.settings ?? null,
    };
  }
  return {
    bucket,
    effectiveBucket: bucket,
    effectiveSettings: bucket.settings ?? null,
  };
}
