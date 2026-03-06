/**
 * Predefined bucket admin roles (same for all buckets).
 * Order: Admin Full, Admin Read, Bucket Full, Bucket Read.
 * CRUD bits: create=1, read=2, update=4, delete=8.
 */
export const PREDEFINED_BUCKET_ROLE_IDS = [
  'everything',
  'read_everything',
  'bucket_full',
  'bucket_read',
] as const;

export type PredefinedBucketRoleId = (typeof PREDEFINED_BUCKET_ROLE_IDS)[number];

export interface PredefinedBucketRole {
  id: PredefinedBucketRoleId;
  nameKey: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud: number;
}

export const PREDEFINED_BUCKET_ROLES: PredefinedBucketRole[] = [
  { id: 'everything', nameKey: 'roles.adminFull', bucketCrud: 15, messageCrud: 15, adminCrud: 15 },
  {
    id: 'read_everything',
    nameKey: 'roles.adminRead',
    bucketCrud: 2,
    messageCrud: 2,
    adminCrud: 2,
  },
  { id: 'bucket_full', nameKey: 'roles.bucketFull', bucketCrud: 15, messageCrud: 15, adminCrud: 0 },
  { id: 'bucket_read', nameKey: 'roles.bucketRead', bucketCrud: 2, messageCrud: 2, adminCrud: 0 },
];

export function getPredefinedRoleById(
  id: PredefinedBucketRoleId
): PredefinedBucketRole | undefined {
  return PREDEFINED_BUCKET_ROLES.find((r) => r.id === id);
}
