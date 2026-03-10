import 'server-only';

import { CRUD_BITS } from '@boilerplate/helpers';
import { request } from '@boilerplate/helpers-requests';

import type { ServerUser } from './server-auth';
import { getCookieHeader, getServerApiBaseUrl } from './server-request';

type BucketAdminRow = {
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
};

type BucketAdminResponse = {
  admin?: BucketAdminRow;
};

type BucketViewerAccess = {
  isOwner: boolean;
  bucketCrud: number;
  messageCrud: number;
  adminCrud: number;
};

const FULL_CRUD = CRUD_BITS.create | CRUD_BITS.read | CRUD_BITS.update | CRUD_BITS.delete;

const hasCrudBit = (crudMask: number, bit: number): boolean => {
  return (crudMask & bit) === bit;
};

const normalizeCrud = (value: number | undefined): number => {
  return typeof value === 'number' ? value : CRUD_BITS.read;
};

async function fetchViewerBucketAdmin(
  bucketId: string,
  user: ServerUser
): Promise<BucketAdminRow | null> {
  const candidateIds = user.shortId === user.id ? [user.id] : [user.shortId, user.id];
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();

  for (const userId of candidateIds) {
    const res = await request(baseUrl, `/buckets/${bucketId}/admins/${userId}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok || res.data === undefined) {
      continue;
    }

    const data = res.data as BucketAdminResponse;
    const admin = data.admin;
    if (
      admin !== undefined &&
      typeof admin.bucketCrud === 'number' &&
      typeof admin.messageCrud === 'number'
    ) {
      return admin;
    }
  }

  return null;
}

async function getBucketViewerAccess(
  bucketId: string,
  bucketOwnerId: string,
  user: ServerUser
): Promise<BucketViewerAccess | null> {
  if (user.id === bucketOwnerId) {
    return {
      isOwner: true,
      bucketCrud: FULL_CRUD,
      messageCrud: FULL_CRUD,
      adminCrud: FULL_CRUD,
    };
  }

  const admin = await fetchViewerBucketAdmin(bucketId, user);
  if (admin === null) {
    return null;
  }

  return {
    isOwner: false,
    bucketCrud: normalizeCrud(admin.bucketCrud),
    messageCrud: normalizeCrud(admin.messageCrud),
    adminCrud: normalizeCrud(admin.adminCrud),
  };
}

export async function canViewBucketSettings(
  bucketId: string,
  bucketOwnerId: string,
  user: ServerUser
): Promise<boolean> {
  const access = await getBucketViewerAccess(bucketId, bucketOwnerId, user);
  if (access === null) {
    return false;
  }
  return access.isOwner || hasCrudBit(access.bucketCrud, CRUD_BITS.update);
}

export async function canCreateBucketRoles(
  bucketId: string,
  bucketOwnerId: string,
  user: ServerUser
): Promise<boolean> {
  const access = await getBucketViewerAccess(bucketId, bucketOwnerId, user);
  if (access === null) {
    return false;
  }
  return access.isOwner || hasCrudBit(access.bucketCrud, CRUD_BITS.update);
}
