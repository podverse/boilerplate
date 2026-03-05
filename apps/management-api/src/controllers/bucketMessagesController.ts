import type { Request, Response } from 'express';
import { BucketMessageService } from '@boilerplate/orm';

import { resolveBucket } from './bucketsController.js';
import type { CreateMessageBody, UpdateMessageBody } from '../schemas/messages.js';
import { messageToJson } from '../lib/messageToJson.js';

export async function listMessages(req: Request, res: Response): Promise<void> {
  const bucketIdParam = req.params.bucketId as string;
  const bucket = await resolveBucket(bucketIdParam);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const offset = Math.max(0, Number(req.query.offset) || 0);

  const messages = await BucketMessageService.findByBucketId(bucket.id, {
    limit,
    offset,
    publicOnly: false,
  });
  res.status(200).json({ messages: messages.map(messageToJson) });
}

export async function getMessage(req: Request, res: Response): Promise<void> {
  const bucketIdParam = req.params.bucketId as string;
  const messageId = req.params.messageId as string;
  const bucket = await resolveBucket(bucketIdParam);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.status(200).json({ message: messageToJson(message) });
}

export async function createMessage(req: Request, res: Response): Promise<void> {
  const bucketIdParam = req.params.bucketId as string;
  const bucket = await resolveBucket(bucketIdParam);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const body = req.body as CreateMessageBody;
  const message = await BucketMessageService.create({
    bucketId: bucket.id,
    senderName: body.senderName,
    body: body.body,
    isPublic: body.isPublic ?? false,
  });
  res.status(201).json({ message: messageToJson(message) });
}

export async function updateMessage(req: Request, res: Response): Promise<void> {
  const bucketIdParam = req.params.bucketId as string;
  const messageId = req.params.messageId as string;
  const bucket = await resolveBucket(bucketIdParam);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  const body = req.body as UpdateMessageBody;
  await BucketMessageService.update(messageId, {
    body: body.body,
    isPublic: body.isPublic,
  });
  const updated = await BucketMessageService.findById(messageId);
  if (updated === null) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.status(200).json({ message: messageToJson(updated) });
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  const bucketIdParam = req.params.bucketId as string;
  const messageId = req.params.messageId as string;
  const bucket = await resolveBucket(bucketIdParam);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const message = await BucketMessageService.findById(messageId);
  if (message === null || message.bucketId !== bucket.id) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  await BucketMessageService.delete(messageId);
  res.status(204).send();
}
