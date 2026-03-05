import type { Request, Response } from 'express';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_SIZE, MAX_TOTAL_CAP } from '@boilerplate/helpers';
import { BucketService, UserService } from '@boilerplate/orm';
import type { Bucket } from '@boilerplate/orm';

import type { CreateBucketBody, UpdateBucketBody } from '../schemas/buckets.js';
import { bucketToJson } from '../lib/bucketToJson.js';

export async function listBuckets(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const searchRaw = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const search = searchRaw === '' ? undefined : searchRaw;
  const offset = (page - 1) * limit;

  const { buckets, total } = await BucketService.listPaginated(limit, offset, search);
  const cappedTotal = total > MAX_TOTAL_CAP ? MAX_TOTAL_CAP : total;
  const totalPages = Math.max(1, Math.ceil(cappedTotal / limit));
  const truncatedTotal = total > MAX_TOTAL_CAP;

  res.status(200).json({
    buckets: buckets.map((bucket) => bucketToJson(bucket)),
    total: cappedTotal,
    page,
    limit,
    totalPages,
    ...(truncatedTotal && { truncatedTotal: true }),
  });
}

function formatOwnerDisplayName(owner: {
  credentials?: { email?: string };
  bio?: { displayName?: string | null } | null;
}): string {
  const email = owner.credentials?.email ?? '';
  const displayName = owner.bio?.displayName?.trim();
  return displayName !== undefined && displayName !== '' && displayName !== null
    ? `${displayName} (${email})`
    : email;
}

/** Resolve bucket by shortId or UUID. Use for all :id and :bucketId params so URLs can use short IDs. */
export async function resolveBucket(idOrShortId: string): Promise<Bucket | null> {
  const byShortId = await BucketService.findByShortId(idOrShortId);
  if (byShortId !== null) return byShortId;
  return BucketService.findById(idOrShortId);
}

export async function getBucket(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await resolveBucket(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const owner = await UserService.findById(bucket.ownerId);
  const ownerDisplayName = owner !== null ? formatOwnerDisplayName(owner) : null;
  res.status(200).json({ bucket: bucketToJson(bucket, ownerDisplayName) });
}

export async function createBucket(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateBucketBody;
  const owner = await UserService.findById(body.ownerId);
  if (owner === null) {
    res.status(400).json({ message: 'Owner not found' });
    return;
  }
  const bucket = await BucketService.create({
    ownerId: body.ownerId,
    name: body.name,
    isPublic: body.isPublic ?? false,
    parentBucketId: null,
  });
  res.status(201).json({ bucket: bucketToJson(bucket) });
}

export async function updateBucket(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await resolveBucket(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
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
  res.status(200).json({ bucket: bucketToJson(updated) });
}

export async function deleteBucket(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await resolveBucket(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  await BucketService.delete(bucket.id);
  res.status(204).send();
}
