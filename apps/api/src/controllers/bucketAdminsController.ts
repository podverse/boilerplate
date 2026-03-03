import type { Request, Response } from 'express';
import { BucketService, BucketAdminService, UserService } from '@boilerplate/orm';
import type { CreateBucketAdminBody, UpdateBucketAdminBody } from '../schemas/buckets.js';
import { userToJson } from '../lib/userToJson.js';
import { canManageBucketAdmins } from '../lib/bucket-policy.js';
import type { UserWithRelations } from '@boilerplate/orm';

function adminToJson(
  admin: {
    id: string;
    bucketId: string;
    userId: string;
    bucketCrud: number;
    messageCrud: number;
    createdAt: Date;
  },
  user: UserWithRelations | null
) {
  return {
    id: admin.id,
    bucketId: admin.bucketId,
    userId: admin.userId,
    bucketCrud: admin.bucketCrud,
    messageCrud: admin.messageCrud,
    createdAt: admin.createdAt,
    user: user !== null ? userToJson(user) : null,
  };
}

export async function listBucketAdmins(req: Request, res: Response): Promise<void> {
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
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const admins = await BucketAdminService.findByBucketId(bucketId);
  const withUser = admins.map((a) => {
    const u =
      a.user !== undefined && a.user !== null && 'credentials' in a.user
        ? (a.user as UserWithRelations)
        : null;
    return adminToJson(a, u);
  });
  res.status(200).json({ admins: withUser });
}

export async function createBucketAdmin(req: Request, res: Response): Promise<void> {
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
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateBucketAdminBody;
  const targetUser = await UserService.findById(body.userId);
  if (targetUser === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(bucketId, body.userId);
  if (existing !== null) {
    res.status(409).json({ message: 'User is already an admin for this bucket' });
    return;
  }
  const admin = await BucketAdminService.create({
    bucketId,
    userId: body.userId,
    bucketCrud: body.bucketCrud ?? 0,
    messageCrud: body.messageCrud ?? 0,
  });
  res.status(201).json({ admin: adminToJson(admin, targetUser) });
}

export async function updateBucketAdmin(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const userId = req.params.userId as string;
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(bucketId, userId);
  if (existing === null) {
    res.status(404).json({ message: 'Bucket admin not found' });
    return;
  }
  const body = req.body as UpdateBucketAdminBody;
  await BucketAdminService.update(bucketId, userId, body);
  const updated = await BucketAdminService.findByBucketAndUser(bucketId, userId);
  const targetUser = await UserService.findById(userId);
  if (updated === null) {
    res.status(500).json({ message: 'Failed to load updated admin' });
    return;
  }
  res.status(200).json({ admin: adminToJson(updated, targetUser) });
}

export async function deleteBucketAdmin(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const userId = req.params.userId as string;
  const bucket = await BucketService.findById(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(bucketId, userId);
  if (existing === null) {
    res.status(404).json({ message: 'Bucket admin not found' });
    return;
  }
  await BucketAdminService.remove(bucketId, userId);
  res.status(204).send();
}
