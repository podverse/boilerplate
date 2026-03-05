import Joi from 'joi';
import { SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

const name = Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH);
const crudMask = Joi.number().integer().min(0).max(15);

export const createBucketSchema = Joi.object({
  name: name.required(),
  isPublic: Joi.boolean().optional(),
  /** Main-app user id (UUID) who will own the bucket. */
  ownerId: Joi.string().uuid().required(),
});

export const updateBucketSchema = Joi.object({
  name: name.optional(),
  isPublic: Joi.boolean().optional(),
  messageBodyMaxLength: Joi.number().integer().min(1).allow(null).optional(),
}).min(1);

/** Create bucket admin invitation. Returns token for shareable link. */
export const createBucketAdminInvitationSchema = Joi.object({
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
  adminCrud: crudMask.optional(),
});

export const updateBucketAdminSchema = Joi.object({
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
  adminCrud: crudMask.optional(),
}).min(1);

export type CreateBucketAdminInvitationBody = {
  bucketCrud?: number;
  messageCrud?: number;
  adminCrud?: number;
};
export type UpdateBucketAdminBody = {
  bucketCrud?: number;
  messageCrud?: number;
  adminCrud?: number;
};

export type CreateBucketBody = { name: string; isPublic?: boolean; ownerId: string };
export type UpdateBucketBody = {
  name?: string;
  isPublic?: boolean;
  messageBodyMaxLength?: number | null;
};
