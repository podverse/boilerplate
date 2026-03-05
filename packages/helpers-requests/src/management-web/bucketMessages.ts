import { request } from '../request.js';
import type { ApiResponse } from '../request.js';

export type ManagementBucketMessage = {
  id: string;
  bucketId: string;
  senderName: string;
  body: string;
  isPublic: boolean;
  createdAt: string;
};

export type CreateMessageBody = { senderName: string; body: string; isPublic?: boolean };
export type UpdateMessageBody = { body?: string; isPublic?: boolean };

export async function listBucketMessages(
  baseUrl: string,
  bucketId: string,
  params?: { limit?: number; offset?: number },
  token?: string | null
): Promise<ApiResponse<{ messages: ManagementBucketMessage[] }>> {
  const searchParams = new URLSearchParams();
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.offset !== undefined) searchParams.set('offset', String(params.offset));
  const query = searchParams.toString();
  const path =
    query !== '' ? `/buckets/${bucketId}/messages?${query}` : `/buckets/${bucketId}/messages`;
  return request<{ messages: ManagementBucketMessage[] }>(baseUrl, path, {
    token: token ?? undefined,
  });
}

export async function getBucketMessage(
  baseUrl: string,
  bucketId: string,
  messageId: string,
  token?: string | null
): Promise<ApiResponse<{ message: ManagementBucketMessage }>> {
  return request<{ message: ManagementBucketMessage }>(
    baseUrl,
    `/buckets/${bucketId}/messages/${messageId}`,
    { token: token ?? undefined }
  );
}

export async function createBucketMessage(
  baseUrl: string,
  bucketId: string,
  body: CreateMessageBody,
  token?: string | null
): Promise<ApiResponse<{ message: ManagementBucketMessage }>> {
  return request<{ message: ManagementBucketMessage }>(baseUrl, `/buckets/${bucketId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
    token: token ?? undefined,
  });
}

export async function updateBucketMessage(
  baseUrl: string,
  bucketId: string,
  messageId: string,
  body: UpdateMessageBody,
  token?: string | null
): Promise<ApiResponse<{ message: ManagementBucketMessage }>> {
  return request<{ message: ManagementBucketMessage }>(
    baseUrl,
    `/buckets/${bucketId}/messages/${messageId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      token: token ?? undefined,
    }
  );
}

export async function deleteBucketMessage(
  baseUrl: string,
  bucketId: string,
  messageId: string,
  token?: string | null
): Promise<ApiResponse<void>> {
  return request<void>(baseUrl, `/buckets/${bucketId}/messages/${messageId}`, {
    method: 'DELETE',
    token: token ?? undefined,
  });
}
