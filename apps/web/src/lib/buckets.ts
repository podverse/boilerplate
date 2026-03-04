import 'server-only';

import type { Bucket, BucketMessage } from '@boilerplate/helpers-requests';
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
 * Server-side: fetch topics (sub-buckets) for a bucket. Returns [] on error or invalid response.
 */
export async function fetchTopics(bucketId: string): Promise<Bucket[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchTopics(baseUrl, bucketId, cookieHeader);
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
