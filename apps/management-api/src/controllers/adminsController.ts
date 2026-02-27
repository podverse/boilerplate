import type { Request, Response } from 'express';
import { ManagementUserService, type EventVisibility } from '@boilerplate/management-orm';
import { hashPassword } from '../lib/auth/hash.js';
import { managementUserToJson } from '../lib/managementUserToJson.js';
import { recordEvent } from '../lib/recordEvent.js';

/**
 * All admin responses use managementUserToJson only. Never return req.managementUser or
 * admin.credentials; passwordHash must not appear in any response (see CREDENTIALS-PROTECTION.md).
 */
export async function listAdmins(_req: Request, res: Response): Promise<void> {
  const list = await ManagementUserService.listAdmins();
  res.status(200).json({ admins: list.map(managementUserToJson) });
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
  const {
    email,
    password,
    displayName,
    adminsCrud = 0,
    usersCrud = 0,
    canChangePasswords = false,
    canAssignPermissions = false,
    eventVisibility = 'own',
  } = req.body as {
    email: string;
    password: string;
    displayName?: string | null;
    adminsCrud?: number;
    usersCrud?: number;
    canChangePasswords?: boolean;
    canAssignPermissions?: boolean;
    eventVisibility?: EventVisibility;
  };

  const existing = await ManagementUserService.findByEmail(email);
  if (existing !== null) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const passwordHash = await hashPassword(password);
  const admin = await ManagementUserService.createAdmin({
    email,
    passwordHash,
    displayName: displayName ?? null,
    createdBy: actor.id,
    adminsCrud,
    usersCrud,
    canChangePasswords,
    canAssignPermissions,
    eventVisibility,
  });
  await recordEvent({
    actor,
    action: 'admin_created',
    targetType: 'admin',
    targetId: admin.id,
    details: email,
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

  const body = req.body as {
    email?: string;
    displayName?: string | null;
    password?: string;
    adminsCrud?: number;
    usersCrud?: number;
    canChangePasswords?: boolean;
    canAssignPermissions?: boolean;
    eventVisibility?: EventVisibility;
  };
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
  if (body.displayName !== undefined) updates.displayName = body.displayName;
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
    await recordEvent({
      actor,
      action: 'admin_updated',
      targetType: 'admin',
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
      action: 'admin_deleted',
      targetType: 'admin',
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
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  if (currentPassword === undefined || newPassword === undefined) {
    res.status(400).json({ message: 'currentPassword and newPassword required' });
    return;
  }
  const { comparePassword } = await import('../lib/auth/hash.js');
  const ok = await comparePassword(currentPassword, actor.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }
  const hashed = await hashPassword(newPassword);
  await ManagementUserService.updatePassword(actor.id, hashed);
  await recordEvent({ actor, action: 'password_changed', targetType: 'admin', targetId: actor.id });
  res.status(204).send();
}
