import type { Request, Response } from 'express';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_SIZE } from '@boilerplate/helpers';
import { BucketAdminService, BucketMessageService, BucketService } from '@boilerplate/orm';
import type {
  CreateMessageBody,
  UpdateMessageBody,
  PublicSubmitMessageBody,
} from '../schemas/buckets.js';
import {
  canReadBucket,
  canReadMessage,
  canCreateMessage,
  canUpdateMessage,
  canDeleteMessage,
} from '../lib/bucket-policy.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';
import { toPublicBucketResponse } from '../lib/bucket-response.js';

export async function listMessages(req: Request, res: Response): Promise<void> {
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
  const { bucket, effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canReadBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const offset = (page - 1) * limit;
  const sortRaw = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const order = sortRaw === 'oldest' ? 'ASC' : 'DESC';
  const messages = await BucketMessageService.findByBucketId(bucket.id, {
    limit,
    offset,
    publicOnly: false,
    order,
  });
  const total = await BucketMessageService.countByBucketId(bucket.id, false);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  res.status(200).json({
    messages,
    page,
    limit,
    total,
    totalPages,
  });
}

export async function getMessage(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const messageId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canReadBucket(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canReadMessage(user.id, effectiveBucket, bucketAdmin, message)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.status(200).json({ message });
}

export async function createMessage(req: Request, res: Response): Promise<void> {
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
  const { bucket, effectiveBucket, effectiveSettings } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canCreateMessage(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateMessageBody;
  const maxLen = effectiveSettings?.messageBodyMaxLength ?? null;
  if (maxLen !== null && maxLen !== undefined && body.body.length > maxLen) {
    res.status(400).json({
      message: `Message body must be at most ${maxLen} characters`,
    });
    return;
  }
  const message = await BucketMessageService.create({
    bucketId: bucket.id,
    senderName: body.senderName,
    body: body.body,
    isPublic: body.isPublic ?? true,
  });
  res.status(201).json({ message });
}

export async function updateMessage(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const messageId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket, effectiveSettings } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canUpdateMessage(user.id, effectiveBucket, bucketAdmin, message)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as UpdateMessageBody;
  const maxLen = effectiveSettings?.messageBodyMaxLength ?? null;
  if (
    body.body !== undefined &&
    maxLen !== null &&
    maxLen !== undefined &&
    body.body.length > maxLen
  ) {
    res.status(400).json({
      message: `Message body must be at most ${maxLen} characters`,
    });
    return;
  }
  await BucketMessageService.update(messageId, body);
  const updated = await BucketMessageService.findById(messageId);
  res.status(200).json({ message: updated });
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const messageId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canDeleteMessage(user.id, effectiveBucket, bucketAdmin, message)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  await BucketMessageService.delete(messageId);
  res.status(204).send();
}

/** Public: get bucket metadata by short_id (only if bucket is public). */
export async function getPublicBucket(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null || !resolved.bucket.isPublic) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveSettings } = resolved;
  const overrides =
    bucket.parentBucketId !== null
      ? { messageBodyMaxLength: effectiveSettings?.messageBodyMaxLength ?? null }
      : undefined;
  const ancestry = await BucketService.findAncestry(bucket.id);
  const ancestors = ancestry
    .filter((b) => b.isPublic)
    .map((b) => ({ shortId: b.shortId, name: b.name }));
  res.status(200).json({ bucket: toPublicBucketResponse(bucket, overrides, ancestors) });
}

/** Public: list public messages in a bucket by short_id (only if bucket is public). */
export async function listPublicMessages(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null || !resolved.bucket.isPublic) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket } = resolved;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const offset = (page - 1) * limit;
  const sortRaw = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const order = sortRaw === 'oldest' ? 'ASC' : 'DESC';
  const messages = await BucketMessageService.findByBucketId(bucket.id, {
    limit,
    offset,
    publicOnly: true,
    order,
  });
  const total = await BucketMessageService.countByBucketId(bucket.id, true);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  res.status(200).json({
    messages,
    page,
    limit,
    total,
    totalPages,
  });
}

/** Public: submit a message to a bucket by short_id (no auth). Bucket must exist; allow submit even when bucket is not public. */
export async function publicSubmitMessage(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const resolved = await getBucketAndEffective(id);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { bucket, effectiveSettings } = resolved;
  const body = req.body as PublicSubmitMessageBody;
  const maxLen = effectiveSettings?.messageBodyMaxLength ?? null;
  if (maxLen !== null && maxLen !== undefined && body.body.length > maxLen) {
    res.status(400).json({
      message: `Message body must be at most ${maxLen} characters`,
    });
    return;
  }
  const message = await BucketMessageService.create({
    bucketId: bucket.id,
    senderName: body.senderName,
    body: body.body,
    isPublic: body.isPublic ?? true,
  });
  res.status(201).json({ message });
}
