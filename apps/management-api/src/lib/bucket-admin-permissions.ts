import { CRUD_BITS } from '@boilerplate/helpers';

const READ_BIT = CRUD_BITS.read;

/**
 * Enforces minimum permissions for bucket admin roles:
 * - Bucket and message must include read.
 * - Message inherits bucket: any bucket permission is also granted for messages.
 */
export function normalizeBucketMessageCrud(
  bucketCrud: number,
  messageCrud: number
): { bucketCrud: number; messageCrud: number } {
  const bucket = bucketCrud | READ_BIT;
  const message = messageCrud | READ_BIT | bucket;
  return { bucketCrud: bucket, messageCrud: message };
}
