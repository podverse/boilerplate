/**
 * Bucket and related types for web bucket API responses.
 * Kept in sync with API response shapes (apps/api).
 */

export type Bucket = {
  id: string;
  shortId: string;
  ownerId: string;
  name: string;
  isPublic: boolean;
  parentBucketId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicBucket = {
  id: string;
  shortId: string;
  name: string;
  isPublic: boolean;
};

/** Authenticated GET /buckets/:id/messages list item. */
export type BucketMessage = {
  id: string;
  bucketId: string;
  senderName: string;
  body: string;
  isPublic: boolean;
  createdAt: string;
};

export type PublicBucketMessage = {
  id: string;
  senderName: string;
  body: string;
  isPublic: boolean;
  createdAt: string;
};

/** Body for POST /buckets/public/:id/messages (unauthenticated submit). */
export type PublicSubmitMessageBody = {
  senderName: string;
  body: string;
  isPublic?: boolean;
};
