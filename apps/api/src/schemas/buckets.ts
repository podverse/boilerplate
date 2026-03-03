import Joi from 'joi';
import { SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

const name = Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH);
const crudMask = Joi.number().integer().min(0).max(15);

export const createBucketSchema = Joi.object({
  name: name.required(),
  isPublic: Joi.boolean().optional(),
});

export const updateBucketSchema = Joi.object({
  name: name.optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

export const createTopicSchema = Joi.object({
  name: name.required(),
  isPublic: Joi.boolean().optional(),
});

export const createBucketAdminSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
});

export const updateBucketAdminSchema = Joi.object({
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
}).min(1);

export const createMessageSchema = Joi.object({
  senderName: Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH).required(),
  body: Joi.string().min(1).required(),
  isPublic: Joi.boolean().optional(),
});

export const updateMessageSchema = Joi.object({
  body: Joi.string().min(1).optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

/** Public submit (no auth): same as createMessage. */
export const publicSubmitMessageSchema = Joi.object({
  senderName: Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH).required(),
  body: Joi.string().min(1).required(),
  isPublic: Joi.boolean().optional(),
});

export type CreateBucketBody = { name: string; isPublic?: boolean };
export type UpdateBucketBody = { name?: string; isPublic?: boolean };
export type CreateTopicBody = { name: string; isPublic?: boolean };
export type CreateBucketAdminBody = { userId: string; bucketCrud?: number; messageCrud?: number };
export type UpdateBucketAdminBody = { bucketCrud?: number; messageCrud?: number };
export type CreateMessageBody = { senderName: string; body: string; isPublic?: boolean };
export type UpdateMessageBody = { body?: string; isPublic?: boolean };
export type PublicSubmitMessageBody = { senderName: string; body: string; isPublic?: boolean };
