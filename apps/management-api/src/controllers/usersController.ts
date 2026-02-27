import type { Request, Response } from 'express';
import type { UserWithRelations } from '@boilerplate/orm';
import { UserService, appDataSource, User, UserBio } from '@boilerplate/orm';
import { hashPassword } from '../lib/auth/hash.js';
import { recordEvent } from '../lib/recordEvent.js';

/**
 * Single place to serialize a main-app user for responses. Returns only safe, non-sensitive fields.
 * Never include passwordHash or pass user.credentials to res.json(). Use this for all user responses.
 */
function userToJson(user: UserWithRelations): { id: string; email: string; displayName: string | null } {
  return {
    id: user.id,
    email: user.credentials.email,
    displayName: user.bio?.displayName ?? null,
  };
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const repo = appDataSource.getRepository(User);
  const users = await repo.find({
    relations: ['credentials', 'bio'],
    order: { createdAt: 'ASC' },
  });
  res.status(200).json({
    users: (users as UserWithRelations[]).map((u) => userToJson(u)),
  });
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const user = await UserService.findById(id);
  if (user === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json({ user: userToJson(user) });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const { email, password, displayName, profileVisibility } = req.body as {
    email: string;
    password: string;
    displayName?: string | null;
    profileVisibility?: boolean;
  };
  const existing = await UserService.findByEmail(email);
  if (existing !== null) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }
  const hashed = await hashPassword(password);
  const user = await UserService.create({
    email,
    password: hashed,
    displayName: displayName ?? null,
    profileVisibility: profileVisibility ?? false,
  });
  await recordEvent({
    actor,
    action: 'user_created',
    targetType: 'user',
    targetId: user.id,
    details: email,
  });
  res.status(201).json({ user: userToJson(user) });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const user = await UserService.findById(id);
  if (user === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const body = req.body as { email?: string; displayName?: string | null; profileVisibility?: boolean };
  if (body.email !== undefined) {
    await UserService.updateEmail(id, body.email);
  }
  if (body.displayName !== undefined || body.profileVisibility !== undefined) {
    const userRepo = appDataSource.getRepository(User);
    const bioRepo = appDataSource.getRepository(UserBio);
    if (body.displayName !== undefined) {
      await bioRepo.update({ userId: id }, { displayName: body.displayName });
    }
    if (body.profileVisibility !== undefined) {
      await userRepo.update(id, { profileVisibility: body.profileVisibility });
    }
  }
  await recordEvent({
    actor,
    action: 'user_updated',
    targetType: 'user',
    targetId: id,
  });
  const updated = await UserService.findById(id);
  res.status(200).json({ user: updated !== null ? userToJson(updated) : userToJson(user) });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const id = req.params.id as string;
  const user = await UserService.findById(id);
  if (user === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const userRepo = appDataSource.getRepository(User);
  await userRepo.delete(id);
  await recordEvent({
    actor,
    action: 'user_deleted',
    targetType: 'user',
    targetId: id,
    details: user.credentials.email,
  });
  res.status(204).send();
}

export async function changeUserPassword(req: Request, res: Response): Promise<void> {
  const actor = req.managementUser;
  if (actor === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  if (!actor.isSuperAdmin) {
    const perm = actor.permissions;
    if (perm === undefined || perm === null || !perm.canChangePasswords) {
      res.status(403).json({ message: 'Insufficient permissions to change user password' });
      return;
    }
  }
  const id = req.params.id as string;
  const user = await UserService.findById(id);
  if (user === null) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const { newPassword } = req.body as { newPassword?: string };
  if (newPassword === undefined) {
    res.status(400).json({ message: 'newPassword required' });
    return;
  }
  const hashed = await hashPassword(newPassword);
  await UserService.updatePassword(id, hashed);
  await recordEvent({
    actor,
    action: 'user_password_changed',
    targetType: 'user',
    targetId: id,
  });
  res.status(204).send();
}
