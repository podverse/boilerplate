import type { Request, Response } from 'express';
import { CRUD_BITS } from '@boilerplate/helpers';
import { BucketAdminService, UserService } from '@boilerplate/orm';
import type { CreateBucketAdminBody, UpdateBucketAdminBody } from '../schemas/buckets.js';
import { normalizeBucketMessageCrud } from '../lib/bucket-admin-permissions.js';
import { userToJson } from '../lib/userToJson.js';
import { canManageBucketAdmins } from '../lib/bucket-policy.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';
import type { UserWithRelations } from '@boilerplate/orm';

/** Admin CRUD always includes read; enforce when serializing or persisting. */
const ADMIN_CRUD_READ = CRUD_BITS.read;

/** Resolve user by shortId or UUID. Prefers shortId for URL/body params. */
async function resolveUser(idOrShortId: string): Promise<UserWithRelations | null> {
  const byShort = await UserService.findByShortId(idOrShortId);
  if (byShort !== null) return byShort;
  return UserService.findById(idOrShortId);
}

function adminToJson(
  admin: {
    id: string;
    bucketId: string;
    userId: string;
    bucketCrud: number;
    messageCrud: number;
    adminCrud: number;
    createdAt: Date;
  },
  user: UserWithRelations | null
) {
  const adminCrud = admin.adminCrud | ADMIN_CRUD_READ;
  return {
    id: admin.id,
    bucketId: admin.bucketId,
    userId: admin.userId,
    bucketCrud: admin.bucketCrud,
    messageCrud: admin.messageCrud,
    adminCrud,
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
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketAdmins(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const admins = await BucketAdminService.findByBucketId(effectiveBucket.id);
  const withUser = admins.map((a) => {
    const u =
      a.user !== undefined && a.user !== null && 'credentials' in a.user
        ? (a.user as UserWithRelations)
        : null;
    return adminToJson(a, u);
  });
  res.status(200).json({ admins: withUser });
}

/** GET /buckets/:bucketId/admins/:userId – get one admin (userId may be shortId or UUID). */
export async function getBucketAdmin(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketAdmins(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const targetUser = await resolveUser(userIdParam);
  if (targetUser === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, targetUser.id);
  if (existing === null) {
    res.status(404).json({ message: 'Bucket admin not found' });
    return;
  }
  res.status(200).json({ admin: adminToJson(existing, targetUser) });
}

export async function createBucketAdmin(req: Request, res: Response): Promise<void> {
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
  const { effectiveBucket, isDescendant } = resolved;
  if (isDescendant) {
    res.status(400).json({
      message: 'Admins are managed on the root bucket only.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketAdmins(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateBucketAdminBody;
  const targetUser = await resolveUser(body.userId);
  if (targetUser === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, targetUser.id);
  if (existing !== null) {
    res.status(409).json({ message: 'User is already an admin for this bucket' });
    return;
  }
  const adminCrud = (body.adminCrud ?? ADMIN_CRUD_READ) | ADMIN_CRUD_READ;
  const { bucketCrud, messageCrud } = normalizeBucketMessageCrud(
    body.bucketCrud ?? 0,
    body.messageCrud ?? 0
  );
  const admin = await BucketAdminService.create({
    bucketId: effectiveBucket.id,
    userId: targetUser.id,
    bucketCrud,
    messageCrud,
    adminCrud,
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
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket, isDescendant } = resolved;
  if (isDescendant) {
    res.status(400).json({
      message: 'Admins are managed on the root bucket only.',
    });
    return;
  }
  const targetUser = await resolveUser(userIdParam);
  if (targetUser === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketAdmins(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, targetUser.id);
  if (existing === null) {
    res.status(404).json({ message: 'Bucket admin not found' });
    return;
  }
  if (targetUser.id === effectiveBucket.ownerId) {
    res.status(403).json({ message: 'Bucket owner cannot be edited' });
    return;
  }
  const body = req.body as UpdateBucketAdminBody;
  const update: { bucketCrud?: number; messageCrud?: number; adminCrud?: number } = {};
  if (body.bucketCrud !== undefined || body.messageCrud !== undefined) {
    const { bucketCrud, messageCrud } = normalizeBucketMessageCrud(
      body.bucketCrud ?? existing.bucketCrud,
      body.messageCrud ?? existing.messageCrud
    );
    update.bucketCrud = bucketCrud;
    update.messageCrud = messageCrud;
  }
  if (body.adminCrud !== undefined) update.adminCrud = body.adminCrud | ADMIN_CRUD_READ;
  if (Object.keys(update).length > 0) {
    await BucketAdminService.update(effectiveBucket.id, targetUser.id, update);
  }
  const updated = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, targetUser.id);
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
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket, isDescendant } = resolved;
  if (isDescendant) {
    res.status(400).json({
      message: 'Admins are managed on the root bucket only.',
    });
    return;
  }
  const targetUser = await resolveUser(userIdParam);
  if (targetUser === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketAdmins(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, targetUser.id);
  if (existing === null) {
    res.status(404).json({ message: 'Bucket admin not found' });
    return;
  }
  if (targetUser.id === effectiveBucket.ownerId) {
    res.status(403).json({ message: 'Bucket owner cannot be removed' });
    return;
  }
  await BucketAdminService.remove(effectiveBucket.id, targetUser.id);
  res.status(204).send();
}
