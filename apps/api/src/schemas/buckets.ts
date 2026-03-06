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
  messageBodyMaxLength: Joi.number().integer().min(1).allow(null).optional(),
}).min(1);

export const createChildBucketSchema = Joi.object({
  name: name.required(),
  isPublic: Joi.boolean().optional(),
});

/** User id: shortId (10–12 chars) or UUID. */
export const createBucketAdminSchema = Joi.object({
  userId: Joi.string().min(10).max(36).required(),
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
  adminCrud: crudMask.optional(),
});

/** Create admin invitation (no userId); returns token for shareable link. */
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

const roleName = Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH);
export const createBucketRoleSchema = Joi.object({
  name: roleName.required(),
  bucketCrud: crudMask.required(),
  messageCrud: crudMask.required(),
  adminCrud: crudMask.required(),
});
export const updateBucketRoleSchema = Joi.object({
  name: roleName.optional(),
  bucketCrud: crudMask.optional(),
  messageCrud: crudMask.optional(),
  adminCrud: crudMask.optional(),
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
export type UpdateBucketBody = {
  name?: string;
  isPublic?: boolean;
  messageBodyMaxLength?: number | null;
};
export type CreateChildBucketBody = { name: string; isPublic?: boolean };
export type CreateBucketAdminBody = {
  userId: string;
  bucketCrud?: number;
  messageCrud?: number;
  adminCrud?: number;
};
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
export type CreateBucketRoleBody = {
  name: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud: number;
};
export type UpdateBucketRoleBody = {
  name?: string;
  bucketCrud?: number;
  messageCrud?: number;
  adminCrud?: number;
};
export type CreateMessageBody = { senderName: string; body: string; isPublic?: boolean };
export type UpdateMessageBody = { body?: string; isPublic?: boolean };
export type PublicSubmitMessageBody = { senderName: string; body: string; isPublic?: boolean };
