import 'server-only';

import type { Bucket, BucketMessage, BucketRoleItem } from '@boilerplate/helpers-requests';
import { request, webBuckets } from '@boilerplate/helpers-requests';

import { getCookieHeader, getServerApiBaseUrl } from './server-request';

/**
 * Server-side: fetch a single bucket by id. Returns null if not found or response invalid.
 */
export async function fetchBucket(id: string): Promise<{ bucket: Bucket | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchBucket(baseUrl, id, cookieHeader);
  if (!res.ok || res.data === undefined) {
    return { bucket: null };
  }
  const bucket = res.data.bucket;
  if (bucket === undefined || typeof bucket?.id !== 'string') {
    return { bucket: null };
  }
  return { bucket };
}

/**
 * Server-side: fetch parent chain from root to immediate parent (root first). Returns [] for root bucket or on error.
 */
export async function fetchBucketAncestry(bucket: Bucket): Promise<Bucket[]> {
  if (bucket.parentBucketId === null) return [];
  const parents: Bucket[] = [];
  let parentId: string | null = bucket.parentBucketId;
  while (parentId !== null) {
    const { bucket: parent } = await fetchBucket(parentId);
    if (parent === null) break;
    parents.unshift(parent);
    parentId = parent.parentBucketId;
  }
  return parents;
}

/**
 * Server-side: fetch child buckets for a bucket. Returns [] on error or invalid response.
 */
export async function fetchChildBuckets(bucketId: string): Promise<Bucket[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchChildBuckets(baseUrl, bucketId, cookieHeader);
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data;
  return Array.isArray(data.buckets) ? data.buckets : [];
}

/**
 * Server-side: fetch messages for a bucket (authenticated). Returns [] on error or invalid response.
 */
export async function fetchMessages(bucketId: string): Promise<BucketMessage[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchBucketMessages(baseUrl, bucketId, cookieHeader);
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data;
  return Array.isArray(data.messages) ? data.messages : [];
}

export type BucketAdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

/**
 * Server-side: fetch bucket admins. Returns [] on error or invalid response.
 */
export async function fetchAdmins(bucketId: string): Promise<BucketAdminRow[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/admins`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data as { admins?: BucketAdminRow[] };
  return Array.isArray(data.admins) ? data.admins : [];
}

export type BucketAdminInvitationRow = {
  id: string;
  token: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  status: string;
  expiresAt: string;
};

/**
 * Server-side: fetch pending admin invitations for a bucket. Returns [] on error or invalid response.
 */
export async function fetchPendingInvitations(
  bucketId: string
): Promise<BucketAdminInvitationRow[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/admin-invitations`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data as { invitations?: BucketAdminInvitationRow[] };
  return Array.isArray(data.invitations) ? data.invitations : [];
}

/**
 * Server-side: fetch bucket roles (predefined + custom). Returns [] on error or invalid response.
 */
export async function fetchBucketRoles(bucketId: string): Promise<BucketRoleItem[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqListBucketRoles(baseUrl, bucketId, cookieHeader);
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data;
  return Array.isArray(data.roles) ? data.roles : [];
}
