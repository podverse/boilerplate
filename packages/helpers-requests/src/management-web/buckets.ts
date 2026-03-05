import { request } from '../request.js';
import type { ApiResponse } from '../request.js';

export type ManagementBucket = {
  id: string;
  shortId: string;
  ownerId: string;
  /** Present on GET /buckets/:id; display name or "email" for owner. */
  ownerDisplayName?: string | null;
  name: string;
  isPublic: boolean;
  parentBucketId: string | null;
  messageBodyMaxLength: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ListBucketsData = {
  buckets: ManagementBucket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  truncatedTotal?: true;
};

/** Token optional; omit for cookie auth (credentials: 'include'). */
export async function listBuckets(
  baseUrl: string,
  params?: { page?: number; limit?: number; search?: string },
  token?: string | null
): Promise<ApiResponse<ListBucketsData>> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set('page', String(params.page));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.search !== undefined && params.search.trim() !== '')
    searchParams.set('search', params.search.trim());
  const query = searchParams.toString();
  const path = query !== '' ? `/buckets?${query}` : '/buckets';
  return request<ListBucketsData>(baseUrl, path, { token: token ?? undefined });
}

export async function getBucket(
  baseUrl: string,
  id: string,
  token?: string | null
): Promise<ApiResponse<{ bucket: ManagementBucket }>> {
  return request<{ bucket: ManagementBucket }>(baseUrl, `/buckets/${id}`, {
    token: token ?? undefined,
  });
}

export type CreateBucketBody = { name: string; isPublic?: boolean; ownerId: string };
export type UpdateBucketBody = {
  name?: string;
  isPublic?: boolean;
  messageBodyMaxLength?: number | null;
};

export async function createBucket(
  baseUrl: string,
  body: CreateBucketBody,
  token?: string | null
): Promise<ApiResponse<{ bucket: ManagementBucket }>> {
  return request<{ bucket: ManagementBucket }>(baseUrl, '/buckets', {
    method: 'POST',
    body: JSON.stringify(body),
    token: token ?? undefined,
  });
}

export async function updateBucket(
  baseUrl: string,
  id: string,
  body: UpdateBucketBody,
  token?: string | null
): Promise<ApiResponse<{ bucket: ManagementBucket }>> {
  return request<{ bucket: ManagementBucket }>(baseUrl, `/buckets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    token: token ?? undefined,
  });
}

export async function deleteBucket(
  baseUrl: string,
  id: string,
  token?: string | null
): Promise<ApiResponse<void>> {
  return request<void>(baseUrl, `/buckets/${id}`, {
    method: 'DELETE',
    token: token ?? undefined,
  });
}
