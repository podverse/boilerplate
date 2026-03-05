import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import {
  BUCKET_ADMIN_INVITATION_EXPIRY_DAYS,
  BUCKET_ADMIN_INVITATION_TOKEN_BYTES,
  CRUD_BITS,
} from '@boilerplate/helpers';
import { BucketAdminInvitationService } from '@boilerplate/orm';
import type { CreateBucketAdminInvitationBody } from '../schemas/buckets.js';
import { getBucketAndEffective } from '../lib/bucket-effective.js';

const ADMIN_CRUD_READ = CRUD_BITS.read;

function generateInvitationToken(): string {
  return randomBytes(BUCKET_ADMIN_INVITATION_TOKEN_BYTES).toString('base64url');
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

export async function createBucketAdminInvitation(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
  const body = req.body as CreateBucketAdminInvitationBody;
  const token = generateInvitationToken();
  const expiresAt = new Date(
    Date.now() + BUCKET_ADMIN_INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );
  const adminCrud = (body.adminCrud ?? ADMIN_CRUD_READ) | ADMIN_CRUD_READ;
  const inv = await BucketAdminInvitationService.create({
    bucketId: effectiveBucket.id,
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

export async function listBucketAdminInvitations(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
  const list = await BucketAdminInvitationService.findByBucketIdPending(effectiveBucket.id);
  res.status(200).json({
    invitations: list.map((inv) => invitationToJson(inv)),
  });
}

export async function deleteBucketAdminInvitation(req: Request, res: Response): Promise<void> {
  const bucketId = req.params.id as string;
  const invitationId = req.params.invitationId as string;
  const resolved = await getBucketAndEffective(bucketId);
  if (resolved === null) {
    res.status(404).json({ message: 'Bucket not found' });
    return;
  }
  const { effectiveBucket } = resolved;
  const list = await BucketAdminInvitationService.findByBucketIdPending(effectiveBucket.id);
  const inv = list.find((i) => i.id === invitationId);
  if (inv === undefined) {
    res.status(404).json({ message: 'Invitation not found or not pending' });
    return;
  }
  await BucketAdminInvitationService.remove(invitationId);
  res.status(204).send();
}
