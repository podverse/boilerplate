import type { Request, Response } from 'express';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_SIZE, MAX_TOTAL_CAP } from '@boilerplate/helpers';
import {
  EVENT_ACTIONS,
  EVENT_TARGET_TYPES,
  ManagementEventService,
  ManagementUserService,
} from '@boilerplate/management-orm';
import type { ChangePasswordBody, CreateAdminBody, UpdateAdminBody } from '../schemas/admins.js';
import { hashPassword } from '../lib/auth/hash.js';
import { managementUserToJson } from '../lib/managementUserToJson.js';
import { recordEvent } from '../lib/recordEvent.js';

/**
 * All admin responses use managementUserToJson only. Never return req.managementUser or
 * admin.credentials; passwordHash must not appear in any response (see CREDENTIALS-PROTECTION.md).
 */
export async function listAdmins(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_LIMIT));
  const searchRaw = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const search = searchRaw === '' ? undefined : searchRaw;
  const offset = (page - 1) * limit;
  const { admins, total } = await ManagementUserService.listAdminsPaginated(limit, offset, search);
  const cappedTotal = total > MAX_TOTAL_CAP ? MAX_TOTAL_CAP : total;
  const totalPages = Math.max(1, Math.ceil(cappedTotal / limit));
  const truncatedTotal = total > MAX_TOTAL_CAP;
  res.status(200).json({
    admins: admins.map(managementUserToJson),
    total: cappedTotal,
    page,
    limit,
    totalPages,
    ...(truncatedTotal && { truncatedTotal: true }),
  });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const admin = await ManagementUserService.findById(id);
  if (admin === null || admin.isSuperAdmin) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }
  res.status(200).json({ admin: managementUserToJson(admin) });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const body = req.body as CreateAdminBody;

  const existingByEmail = await ManagementUserService.findByEmail(body.email);
  if (existingByEmail !== null) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }
  const existingByDisplayName = await ManagementUserService.findByDisplayName(
    body.displayName.trim()
  );
  if (existingByDisplayName !== null) {
    res.status(409).json({ message: 'Display name already in use' });
    return;
  }

  const passwordHash = await hashPassword(body.password);
  const admin = await ManagementUserService.createAdmin({
    email: body.email,
    passwordHash,
    displayName: body.displayName.trim(),
    createdBy: actor.id,
    adminsCrud: body.adminsCrud,
    usersCrud: body.usersCrud,
    canChangePasswords: body.canChangePasswords,
    canAssignPermissions: body.canAssignPermissions,
    eventVisibility: body.eventVisibility,
  });
  await recordEvent({
    actor,
    action: EVENT_ACTIONS.admin.created,
    targetType: EVENT_TARGET_TYPES.admin,
    targetId: admin.id,
    details: body.email,
  });
  res.status(201).json({ admin: managementUserToJson(admin) });
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const admin = await ManagementUserService.findById(id);
  if (admin === null || admin.isSuperAdmin) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }

  const body = req.body as UpdateAdminBody;
  if (body.displayName !== undefined) {
    const other = await ManagementUserService.findByDisplayName(body.displayName.trim());
    if (other !== null && other.id !== id) {
      res.status(409).json({ message: 'Display name already in use' });
      return;
    }
  }
  const permissionKeys = [
    'adminsCrud',
    'usersCrud',
    'canChangePasswords',
    'canAssignPermissions',
    'eventVisibility',
  ] as const;
  const hasPermissionUpdate = permissionKeys.some((k) => body[k] !== undefined);
  if (hasPermissionUpdate && !actor.isSuperAdmin) {
    res.status(403).json({ message: 'Only super admin can update permissions' });
    return;
  }
  const updates: Parameters<typeof ManagementUserService.updateAdmin>[1] = {};
  if (body.email !== undefined) updates.email = body.email;
  if (body.displayName !== undefined) updates.displayName = body.displayName.trim();
  if (body.password !== undefined) updates.passwordHash = await hashPassword(body.password);
  if (body.adminsCrud !== undefined) updates.adminsCrud = body.adminsCrud;
  if (body.usersCrud !== undefined) updates.usersCrud = body.usersCrud;
  if (body.canChangePasswords !== undefined) updates.canChangePasswords = body.canChangePasswords;
  if (body.canAssignPermissions !== undefined)
    updates.canAssignPermissions = body.canAssignPermissions;
  if (body.eventVisibility !== undefined) updates.eventVisibility = body.eventVisibility;

  if (Object.keys(updates).length === 0) {
    res.status(200).json({ admin: managementUserToJson(admin) });
    return;
  }

  const updated = await ManagementUserService.updateAdmin(id, updates);
  if (updated !== null) {
    if (body.displayName !== undefined) {
      try {
        await ManagementEventService.updateActorDisplayName(id, body.displayName.trim());
      } catch (err) {
        // Non-critical: admin is already saved; log but do not roll back.
        console.error('Failed to update actor_display_name in events', err);
      }
    }
    await recordEvent({
      actor,
      action: EVENT_ACTIONS.admin.updated,
      targetType: EVENT_TARGET_TYPES.admin,
      targetId: id,
    });
    res.status(200).json({ admin: managementUserToJson(updated) });
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
}

export async function deleteAdmin(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const admin = await ManagementUserService.findById(id);
  if (admin === null || admin.isSuperAdmin) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }
  const deleted = await ManagementUserService.deleteById(id);
  if (deleted) {
    await recordEvent({
      actor,
      action: EVENT_ACTIONS.admin.deleted,
      targetType: EVENT_TARGET_TYPES.admin,
      targetId: id,
      details: admin.credentials.email,
    });
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const { currentPassword, newPassword } = req.body as ChangePasswordBody;
  const { comparePassword } = await import('../lib/auth/hash.js');
  const ok = await comparePassword(currentPassword, actor.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }
  const hashed = await hashPassword(newPassword);
  await ManagementUserService.updatePassword(actor.id, hashed);
  await recordEvent({
    actor,
    action: EVENT_ACTIONS.admin.passwordChanged,
    targetType: EVENT_TARGET_TYPES.admin,
    targetId: actor.id,
  });
  res.status(204).send();
}
