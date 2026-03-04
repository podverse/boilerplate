import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { CRUD_BITS } from '@boilerplate/helpers';
import { BucketService, BucketAdminService, BucketAdminInvitationService } from '@boilerplate/orm';
import type { CreateBucketAdminInvitationBody } from '../schemas/buckets.js';
import { canManageBucketAdmins } from '../lib/bucket-policy.js';

const INVITATION_TOKEN_BYTES = 32;
const ADMIN_CRUD_READ = CRUD_BITS.read;

function generateInvitationToken(): string {
  return randomBytes(INVITATION_TOKEN_BYTES).toString('base64url');
}

/** GET /admin-invitations/:token – public, returns invitation details for the invite page. */
export async function getInvitationByToken(req: Request, res: Response): Promise<void> {
  const token = req.params.token as string;
  const inv = await BucketAdminInvitationService.findByToken(token);
  if (inv === null) {
    res.status(404).json({ message: 'Invitation not found or invalid' });
    return;
  }
  if (inv.status !== 'pending') {
    res.status(410).json({
      message:
        inv.status === 'accepted' ? 'Invitation already accepted' : 'Invitation was declined',
      status: inv.status,
    });
    return;
  }
  const bucket = inv.bucket;
  res.status(200).json({
    invitation: {
      token: inv.token,
      bucketId: inv.bucketId,
      bucketShortId: bucket?.shortId ?? undefined,
      bucketName: bucket?.name ?? undefined,
      bucketCrud: inv.bucketCrud,
      messageCrud: inv.messageCrud,
      adminCrud: inv.adminCrud | ADMIN_CRUD_READ,
      status: inv.status,
    },
  });
}

/** POST /buckets/:bucketId/admin-invitations – create invitation (auth, can manage admins). */
export async function createBucketAdminInvitation(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const bucket = await BucketService.findByShortId(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const body = req.body as CreateBucketAdminInvitationBody;
  const token = generateInvitationToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const adminCrud = (body.adminCrud ?? ADMIN_CRUD_READ) | ADMIN_CRUD_READ;
  const inv = await BucketAdminInvitationService.create({
    bucketId: bucket.id,
    token,
    bucketCrud: body.bucketCrud ?? 0,
    messageCrud: body.messageCrud ?? 0,
    adminCrud,
    expiresAt,
  });
  res.status(201).json({
    invitation: {
      id: inv.id,
      token: inv.token,
      bucketCrud: inv.bucketCrud,
      messageCrud: inv.messageCrud,
      adminCrud: inv.adminCrud,
      status: inv.status,
      expiresAt: inv.expiresAt.toISOString(),
    },
  });
}

function invitationToJson(inv: {
  id: string;
  token: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud: number;
  status: string;
  expiresAt: Date;
}) {
  return {
    id: inv.id,
    token: inv.token,
    bucketCrud: inv.bucketCrud,
    messageCrud: inv.messageCrud,
    adminCrud: inv.adminCrud,
    status: inv.status,
    expiresAt: inv.expiresAt.toISOString(),
  };
}

/** GET /buckets/:bucketId/admin-invitations – list pending invitations (auth, can manage admins). */
export async function listBucketAdminInvitations(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const bucket = await BucketService.findByShortId(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const list = await BucketAdminInvitationService.findByBucketIdPending(bucket.id);
  res.status(200).json({
    invitations: list.map((inv) => invitationToJson(inv)),
  });
}

/** DELETE /buckets/:bucketId/admin-invitations/:invitationId – delete a pending invitation. */
export async function deleteBucketAdminInvitation(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const bucketId = req.params.bucketId as string;
  const invitationId = req.params.invitationId as string;
  const bucket = await BucketService.findByShortId(bucketId);
  if (bucket === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const bucketAdmin = await BucketAdminService.findByBucketAndUser(bucket.id, user.id);
  if (!canManageBucketAdmins(user.id, bucket, bucketAdmin)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const list = await BucketAdminInvitationService.findByBucketIdPending(bucket.id);
  const inv = list.find((i) => i.id === invitationId);
  if (inv === undefined) {
    res.status(404).json({ message: 'Invitation not found or not pending' });
    return;
  }
  await BucketAdminInvitationService.remove(invitationId);
  res.status(204).send();
}

/** POST /admin-invitations/:token/accept – accept invitation (auth), creates bucket_admin. */
export async function acceptInvitation(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const token = req.params.token as string;
  const inv = await BucketAdminInvitationService.findByToken(token);
  if (inv === null) {
    res.status(404).json({ message: 'Invitation not found or invalid' });
    return;
  }
  if (inv.status !== 'pending') {
    res.status(410).json({
      message:
        inv.status === 'accepted' ? 'Invitation already accepted' : 'Invitation was declined',
      status: inv.status,
    });
    return;
  }
  const existing = await BucketAdminService.findByBucketAndUser(inv.bucketId, user.id);
  if (existing !== null) {
    await BucketAdminInvitationService.updateStatus(inv.id, 'accepted');
    res
      .status(200)
      .json({ message: 'You are already an admin for this bucket', alreadyAdmin: true });
    return;
  }
  const adminCrud = inv.adminCrud | ADMIN_CRUD_READ;
  await BucketAdminService.create({
    bucketId: inv.bucketId,
    userId: user.id,
    bucketCrud: inv.bucketCrud,
    messageCrud: inv.messageCrud,
    adminCrud,
  });
  await BucketAdminInvitationService.updateStatus(inv.id, 'accepted');
  res.status(200).json({ message: 'You have been added as an admin', accepted: true });
}

/** POST /admin-invitations/:token/reject – reject invitation (auth). */
export async function rejectInvitation(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const token = req.params.token as string;
  const inv = await BucketAdminInvitationService.findByToken(token);
  if (inv === null) {
    res.status(404).json({ message: 'Invitation not found or invalid' });
    return;
  }
  if (inv.status !== 'pending') {
    res.status(410).json({
      message: 'Invitation is no longer pending',
      status: inv.status,
    });
    return;
  }
  await BucketAdminInvitationService.updateStatus(inv.id, 'rejected');
  res.status(200).json({ message: 'Invitation declined', rejected: true });
}
