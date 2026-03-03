import type { Request, Response } from 'express';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_SIZE } from '@boilerplate/helpers';
import { BucketService, BucketAdminService, BucketMessageService } from '@boilerplate/orm';
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

export async function listMessages(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canReadBucket(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const offset = (page - 1) * limit;
  const messages = await BucketMessageService.findByBucketId(bucketId, {
    limit,
    offset,
    publicOnly: false,
  });
  const total = await BucketMessageService.countByBucketId(bucketId, false);
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
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canReadBucket(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucketId) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canReadMessage(user.id, bucket, bucketAdmin, message)) {
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
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canCreateMessage(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateMessageBody;
  const message = await BucketMessageService.create({
    bucketId,
    senderName: body.senderName,
    body: body.body,
    isPublic: body.isPublic ?? false,
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
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucketId) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canUpdateMessage(user.id, bucket, bucketAdmin, message)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as UpdateMessageBody;
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
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucketId) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  if (!canDeleteMessage(user.id, bucket, bucketAdmin, message)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  await BucketMessageService.delete(messageId);
  res.status(204).send();
}

/** Public: get bucket metadata by id (only if bucket is public). */
export async function getPublicBucket(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await BucketService.findById(id);
  if (bucket === null || !bucket.isPublic) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  res.status(200).json({ bucket });
}

/** Public: list public messages in a bucket by id (only if bucket is public). */
export async function listPublicMessages(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await BucketService.findById(id);
  if (bucket === null || !bucket.isPublic) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const offset = (page - 1) * limit;
  const messages = await BucketMessageService.findByBucketId(bucket.id, {
    limit,
    offset,
    publicOnly: true,
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

/** Public: submit a message to a bucket by id (no auth). Bucket must exist; allow submit even when bucket is not public. */
export async function publicSubmitMessage(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const bucket = await BucketService.findById(id);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const body = req.body as PublicSubmitMessageBody;
  const message = await BucketMessageService.create({
    bucketId: bucket.id,
    senderName: body.senderName,
    body: body.body,
    isPublic: body.isPublic ?? false,
  });
  res.status(201).json({ message });
}
