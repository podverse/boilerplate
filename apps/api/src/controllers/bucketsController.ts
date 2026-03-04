import type { Request, Response } from 'express';
import { BucketService, BucketAdminService } from '@boilerplate/orm';
import type { CreateBucketBody, UpdateBucketBody, CreateTopicBody } from '../schemas/buckets.js';
import {
  canReadBucket,
  canUpdateBucket,
  canDeleteBucket,
  canCreateBucket,
} from '../lib/bucket-policy.js';
import { toBucketResponse } from '../lib/bucket-response.js';

export async function listBuckets(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const buckets = await BucketService.findAccessibleByUser(user.id);
  res.status(200).json({ buckets: buckets.map(toBucketResponse) });
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
    isPublic: body.isPublic ?? false,
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
  const bucket = await BucketService.findByShortId(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canReadBucket(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.status(200).json({ bucket: toBucketResponse(bucket) });
}

export async function updateBucket(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const bucket = await BucketService.findByShortId(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canUpdateBucket(user.id, bucket, bucketAdmin)) {
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
  const bucket = await BucketService.findByShortId(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canDeleteBucket(user.id, bucket, bucketAdmin)) {
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
  res.status(200).json({ buckets: topics.map(toBucketResponse) });
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
    ownerId: user.id,
    name: body.name,
    isPublic: body.isPublic ?? false,
    parentBucketId: parent.id,
  });
  res.status(201).json({ bucket: toBucketResponse(topic) });
}
