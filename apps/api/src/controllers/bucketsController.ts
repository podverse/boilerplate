import type { Request, Response } from 'express';
import { BucketService, BucketAdminService, BucketMessageService } from '@boilerplate/orm';
import type { CreateBucketBody, UpdateBucketBody, CreateTopicBody } from '../schemas/buckets.js';
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
  const { bucket, effectiveBucket } = resolved;
  if (bucket.parentBucketId !== null) {
    res.status(400).json({
      message:
        'Topic buckets inherit settings from the parent bucket; update the parent bucket instead.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canUpdateBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as UpdateBucketBody;
  await BucketService.update(bucket.id, {
    name: body.name,
    isPublic: body.isPublic,
    messageBodyMaxLength: body.messageBodyMaxLength,
  });
  const updated = await BucketService.findById(bucket.id);
  if (updated === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  res.status(200).json({ bucket: toBucketResponse(updated) });
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

export async function listTopics(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const parent = await BucketService.findByShortId(bucketId);
  if (parent === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(parent.id, user.id);
  if (!canReadBucket(user.id, parent, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const topics = await BucketService.findChildren(parent.id);
  const topicIds = topics.map((t) => t.id);
  const lastMessageAtMap =
    await BucketMessageService.getLatestMessageCreatedAtByBucketIds(topicIds);
  const inheritedOverrides = {
    messageBodyMaxLength: parent.settings?.messageBodyMaxLength ?? null,
    ownerId: parent.ownerId,
  };
  res.status(200).json({
    buckets: topics.map((t) =>
      toBucketResponse(t, {
        ...inheritedOverrides,
        lastMessageAt: lastMessageAtMap.get(t.id)?.toISOString() ?? null,
      })
    ),
  });
}

export async function createTopic(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const parent = await BucketService.findByShortId(bucketId);
  if (parent === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  if (parent.parentBucketId !== null) {
    res.status(400).json({
      message: 'Parent must be a top-level bucket; nested buckets are not allowed.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(parent.id, user.id);
  if (!canCreateBucket(user.id, parent, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateTopicBody;
  const topic = await BucketService.create({
    ownerId: parent.ownerId,
    name: body.name,
    isPublic: body.isPublic ?? true,
    parentBucketId: parent.id,
  });
  const overrides = {
    messageBodyMaxLength: parent.settings?.messageBodyMaxLength ?? null,
    ownerId: parent.ownerId,
  };
  res.status(201).json({ bucket: toBucketResponse(topic, overrides) });
}
