import type { CreateBucketRoleBody, UpdateBucketRoleBody } from '../schemas/buckets.js';
import type { BucketRole } from '@boilerplate/orm';
import type { Request, Response } from 'express';

import { PREDEFINED_BUCKET_ROLES } from '@boilerplate/helpers';
import { BucketAdminService, BucketRoleService } from '@boilerplate/orm';

import { normalizeBucketMessageCrud } from '../lib/bucket-admin-permissions.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';
import { canManageBucketRoles } from '../lib/bucket-policy.js';

function predefinedToJson(role: (typeof PREDEFINED_BUCKET_ROLES)[number]) {
  return {
    id: role.id,
    nameKey: role.nameKey,
    bucketCrud: role.bucketCrud,
    bucketMessagesCrud: role.bucketMessagesCrud,
    bucketAdminsCrud: role.bucketAdminsCrud,
    isPredefined: true as const,
    createdAt: null as string | null,
  };
}

function customRoleToJson(role: BucketRole) {
  return {
    id: role.id,
    name: role.name,
    bucketCrud: role.bucketCrud,
    bucketMessagesCrud: role.bucketMessagesCrud,
    bucketAdminsCrud: role.bucketAdminsCrud,
    isPredefined: false as const,
    createdAt: role.createdAt.toISOString(),
  };
}

export async function listBucketRoles(req: Request, res: Response): Promise<void> {
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
  if (!canManageBucketRoles(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const customRoles = await BucketRoleService.findByBucketId(effectiveBucket.id);
  const predefined = PREDEFINED_BUCKET_ROLES.map(predefinedToJson);
  const custom = customRoles.map(customRoleToJson);
  res.status(200).json({
    roles: [...predefined, ...custom],
  });
}

export async function createBucketRole(req: Request, res: Response): Promise<void> {
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
      message: 'Roles are managed on the root bucket only.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketRoles(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateBucketRoleBody;
  const { bucketCrud, bucketMessagesCrud } = normalizeBucketMessageCrud(
    body.bucketCrud,
    body.bucketMessagesCrud
  );
  const role = await BucketRoleService.create({
    bucketId: effectiveBucket.id,
    name: body.name,
    bucketCrud,
    bucketMessagesCrud,
    bucketAdminsCrud: body.bucketAdminsCrud,
  });
  res.status(201).json({ role: customRoleToJson(role) });
}

export async function updateBucketRole(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const roleId = req.params.roleId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket, isDescendant } = resolved;
  if (isDescendant) {
    res.status(400).json({
      message: 'Roles are managed on the root bucket only.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketRoles(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const role = await BucketRoleService.findByBucketAndId(effectiveBucket.id, roleId);
  if (role === null) {
    res.status(404).json({ message: 'Role not found' });
    return;
  }
  const body = req.body as UpdateBucketRoleBody;
  const update: {
    name?: string;
    bucketCrud?: number;
    bucketMessagesCrud?: number;
    bucketAdminsCrud?: number;
  } = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.bucketCrud !== undefined || body.bucketMessagesCrud !== undefined) {
    const { bucketCrud, bucketMessagesCrud } = normalizeBucketMessageCrud(
      body.bucketCrud ?? role.bucketCrud,
      body.bucketMessagesCrud ?? role.bucketMessagesCrud
    );
    update.bucketCrud = bucketCrud;
    update.bucketMessagesCrud = bucketMessagesCrud;
  }
  if (body.bucketAdminsCrud !== undefined) update.bucketAdminsCrud = body.bucketAdminsCrud;
  if (Object.keys(update).length > 0) {
    await BucketRoleService.update(roleId, update);
  }
  const updated = await BucketRoleService.findByBucketAndId(effectiveBucket.id, roleId);
  if (updated === null) {
    res.status(500).json({ message: 'Failed to load updated role' });
    return;
  }
  res.status(200).json({ role: customRoleToJson(updated) });
}

export async function deleteBucketRole(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const roleId = req.params.roleId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket, isDescendant } = resolved;
  if (isDescendant) {
    res.status(400).json({
      message: 'Roles are managed on the root bucket only.',
    });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(effectiveBucket.id, user.id);
  if (!canManageBucketRoles(user.id, effectiveBucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const role = await BucketRoleService.findByBucketAndId(effectiveBucket.id, roleId);
  if (role === null) {
    res.status(404).json({ message: 'Role not found' });
    return;
  }
  await BucketRoleService.delete(roleId);
  res.status(204).send();
}
