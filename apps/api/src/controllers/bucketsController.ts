import type { Request, Response } from 'express';
import { BucketService, BucketAdminService, BucketMessageService } from '@boilerplate/orm';
import type {
  CreateBucketBody,
  UpdateBucketBody,
  CreateChildBucketBody,
} from '../schemas/buckets.js';
import {
  canReadBucket,
  canUpdateBucket,
  canDeleteBucket,
  canCreateBucket,
} from '../lib/bucket-policy.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';
import { toBucketResponse } from '../lib/bucket-response.js';

export async function listBuckets(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const search =
    typeof req.query.search === 'string' && req.query.search.trim() !== ''
      ? req.query.search.trim()
      : undefined;
  const sortByRaw = typeof req.query.sortBy === 'string' ? req.query.sortBy.trim() : undefined;
  const sortBy = sortByRaw === '' ? undefined : sortByRaw;
  const sortOrderRaw = req.query.sortOrder;
  const sortOrder = sortOrderRaw === 'asc' || sortOrderRaw === 'desc' ? sortOrderRaw : undefined;
  const buckets = await BucketService.findAccessibleByUser(user.id, {
    search,
    sortBy,
    sortOrder,
  });
  const parentIds = [
    ...new Set(
      buckets
        .map((b) => b.parentBucketId)
        .filter((id): id is string => id !== null && id !== undefined)
    ),
  ];
  const pairs = await Promise.all(
    parentIds.map(async (id) => {
      const parent = await BucketService.findById(id);
      return [id, parent] as [string, Awaited<ReturnType<typeof BucketService.findById>>];
    })
  );
  const parentMap = new Map(pairs);
  const bucketResponses = buckets.map((bucket) => {
    if (bucket.parentBucketId !== null) {
      const parent = parentMap.get(bucket.parentBucketId) ?? null;
      const overrides =
        parent !== null
          ? {
              messageBodyMaxLength: parent.settings?.messageBodyMaxLength ?? null,
              ownerId: parent.ownerId,
            }
          : undefined;
      return toBucketResponse(bucket, overrides);
    }
    return toBucketResponse(bucket);
  });
  res.status(200).json({ buckets: bucketResponses });
}

export async function createBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const body = req.body as CreateBucketBody;
  const bucket = await BucketService.create({
    ownerId: user.id,
    name: body.name,
    isPublic: body.isPublic ?? true,
    parentBucketId: null,
  });
  res.status(201).json({ bucket: toBucketResponse(bucket) });
}

export async function getBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket, effectiveSettings } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canReadBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const overrides =
    bucket.parentBucketId !== null
      ? {
          messageBodyMaxLength: effectiveSettings?.messageBodyMaxLength ?? null,
          ownerId: effectiveBucket.ownerId,
        }
      : undefined;
  res.status(200).json({ bucket: toBucketResponse(bucket, overrides) });
}

export async function updateBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket, isDescendant } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canUpdateBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as UpdateBucketBody;
  if (isDescendant) {
    if (body.name === undefined) {
      res.status(400).json({
        message:
          'Descendant buckets inherit settings from the root bucket; only name can be updated.',
      });
      return;
    }
    if (body.isPublic !== undefined || body.messageBodyMaxLength !== undefined) {
      res.status(400).json({
        message:
          'Descendant buckets inherit settings from the root bucket; only name can be updated.',
      });
      return;
    }
    await BucketService.update(bucket.id, { name: body.name });
  } else {
    await BucketService.update(bucket.id, {
      name: body.name,
      isPublic: body.isPublic,
      messageBodyMaxLength: body.messageBodyMaxLength,
    });
  }
  const updated = await BucketService.findById(bucket.id);
  if (updated === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const overrides =
    updated.parentBucketId !== null
      ? {
          messageBodyMaxLength: resolved.effectiveSettings?.messageBodyMaxLength ?? null,
          ownerId: effectiveBucket.ownerId,
        }
      : undefined;
  res.status(200).json({ bucket: toBucketResponse(updated, overrides) });
}

export async function deleteBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canDeleteBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  await BucketService.delete(bucket.id);
  res.status(204).send();
}

export async function listChildBuckets(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket: parent, effectiveBucket, effectiveSettings } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canReadBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const childBuckets = await BucketService.findChildren(parent.id);
  const childBucketIds = childBuckets.map((childBucket) => childBucket.id);
  const lastMessageAtMap =
    await BucketMessageService.getLatestMessageCreatedAtByBucketIds(childBucketIds);
  const inheritedOverrides = {
    messageBodyMaxLength: effectiveSettings?.messageBodyMaxLength ?? null,
    ownerId: effectiveBucket.ownerId,
  };
  res.status(200).json({
    buckets: childBuckets.map((childBucket) =>
      toBucketResponse(childBucket, {
        ...inheritedOverrides,
        lastMessageAt: lastMessageAtMap.get(childBucket.id)?.toISOString() ?? null,
      })
    ),
  });
}

export async function createChildBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket: parent, effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canCreateBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateChildBucketBody;
  const childBucket = await BucketService.create({
    ownerId: effectiveBucket.ownerId,
    name: body.name,
    isPublic: body.isPublic ?? true,
    parentBucketId: parent.id,
  });
  const overrides = {
    messageBodyMaxLength: resolved.effectiveSettings?.messageBodyMaxLength ?? null,
    ownerId: effectiveBucket.ownerId,
  };
  res.status(201).json({ bucket: toBucketResponse(childBucket, overrides) });
}
