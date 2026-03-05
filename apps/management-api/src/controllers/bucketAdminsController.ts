import type { Request, Response } from 'express';
import { CRUD_BITS } from '@boilerplate/helpers';
import { BucketAdminService, UserService } from '@boilerplate/orm';
import type { UserWithRelations } from '@boilerplate/orm';
import type { UpdateBucketAdminBody } from '../schemas/buckets.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';

const ADMIN_CRUD_READ = CRUD_BITS.read;

/** Serialize main-app user for bucket admin responses (id, shortId, email, displayName). */
function mainAppUserToJson(user: UserWithRelations): {
  id: string;
  shortId: string;
  email: string;
  displayName: string | null;
} {
  return {
    id: user.id,
    shortId: user.shortId,
    email: user.credentials.email,
    displayName: user.bio?.displayName ?? null,
  };
}

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
    createdAt: admin.createdAt.toISOString(),
    user: user !== null ? mainAppUserToJson(user) : null,
  };
}

export async function listBucketAdmins(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
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

export async function getBucketAdmin(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
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

export async function updateBucketAdmin(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
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
  if (targetUser.id === effectiveBucket.ownerId) {
    res.status(403).json({ message: 'Bucket owner cannot be edited' });
    return;
  }
  const body = req.body as UpdateBucketAdminBody;
  const update: { bucketCrud?: number; messageCrud?: number; adminCrud?: number } = {};
  if (body.bucketCrud !== undefined) update.bucketCrud = body.bucketCrud;
  if (body.messageCrud !== undefined) update.messageCrud = body.messageCrud;
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
  const bucketId = req.params.id as string;
  const userIdParam = req.params.userId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
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
  if (targetUser.id === effectiveBucket.ownerId) {
    res.status(403).json({ message: 'Bucket owner cannot be removed' });
    return;
  }
  await BucketAdminService.remove(effectiveBucket.id, targetUser.id);
  res.status(204).send();
}
