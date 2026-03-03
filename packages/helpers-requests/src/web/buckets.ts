import { request } from '../request.js';
import type { ApiResponse } from '../request.js';
import type {
  Bucket,
  BucketMessage,
  PublicBucket,
  PublicBucketMessage,
  PublicSubmitMessageBody,
} from '../types/bucket-types.js';

const SERVER_OPTIONS = { cache: 'no-store' as RequestCache } as const;

/**
 * GET /buckets/:id (authenticated). Use for server-side fetch with cookie.
 * API returns { bucket }.
 */
export async function reqFetchBucket(
  baseUrl: string,
  bucketId: string,
  cookieHeader: string
): Promise<ApiResponse<{ bucket: Bucket }>> {
  return request<{ bucket: Bucket }>(baseUrl, `/buckets/${bucketId}`, {
    headers: { Cookie: cookieHeader },
    ...SERVER_OPTIONS,
  });
}

/**
 * GET /buckets/:bucketId/buckets (authenticated). Returns sub-buckets (topics).
 */
export async function reqFetchTopics(
  baseUrl: string,
  bucketId: string,
  cookieHeader: string
): Promise<ApiResponse<{ buckets: Bucket[] }>> {
  return request<{ buckets: Bucket[] }>(baseUrl, `/buckets/${bucketId}/buckets`, {
    headers: { Cookie: cookieHeader },
    ...SERVER_OPTIONS,
  });
}

/**
 * GET /buckets/:bucketId/messages (authenticated). List messages for a bucket.
 */
export async function reqFetchBucketMessages(
  baseUrl: string,
  bucketId: string,
  cookieHeader: string
): Promise<ApiResponse<{ messages?: BucketMessage[] }>> {
  return request<{ messages?: BucketMessage[] }>(baseUrl, `/buckets/${bucketId}/messages`, {
    headers: { Cookie: cookieHeader },
    ...SERVER_OPTIONS,
  });
}

/**
 * GET /buckets/public/:id (unauthenticated). Public bucket by slug or id.
 */
export async function reqFetchPublicBucket(
  baseUrl: string,
  bucketId: string
): Promise<ApiResponse<{ bucket?: PublicBucket }>> {
  return request<{ bucket?: PublicBucket }>(baseUrl, `/buckets/public/${bucketId}`, {
    ...SERVER_OPTIONS,
  });
}

/**
 * GET /buckets/public/:id/messages (unauthenticated). Public messages for a bucket.
 */
export async function reqFetchPublicBucketMessages(
  baseUrl: string,
  bucketId: string
): Promise<ApiResponse<{ messages?: PublicBucketMessage[] }>> {
  return request<{ messages?: PublicBucketMessage[] }>(
    baseUrl,
    `/buckets/public/${bucketId}/messages`,
    { ...SERVER_OPTIONS }
  );
}

/**
 * DELETE /buckets/:id (authenticated). Deletes a bucket. Use from client with credentials.
 */
export async function reqDeleteBucket(
  baseUrl: string,
  bucketId: string,
  cookieHeader?: string
): Promise<ApiResponse<void>> {
  const options: { method: string; headers?: { Cookie: string }; cache?: RequestCache } = {
    method: 'DELETE',
    ...SERVER_OPTIONS,
  };
  if (cookieHeader !== undefined && cookieHeader !== '') {
    options.headers = { Cookie: cookieHeader };
  }
  const res = await request<void>(baseUrl, `/buckets/${bucketId}`, options);
  return res;
}

/**
 * POST /buckets/public/:id/messages (unauthenticated). Submit a message to a public bucket.
 */
export async function reqPostPublicBucketMessage(
  baseUrl: string,
  bucketId: string,
  body: PublicSubmitMessageBody
): Promise<ApiResponse<{ message?: PublicBucketMessage }>> {
  return request<{ message?: PublicBucketMessage }>(
    baseUrl,
    `/buckets/public/${bucketId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'omit',
      ...SERVER_OPTIONS,
    }
  );
}
