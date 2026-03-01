import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SHORT_TEXT_MAX_LENGTH,
} from '@boilerplate/helpers';
import Joi from 'joi';

export type {
  ChangePasswordBody,
  CreateAdminBody,
  UpdateAdminBody,
} from '@boilerplate/helpers-requests';

const crudSchema = Joi.number().integer().min(0).max(15);
const eventVisibilitySchema = Joi.string().valid('own', 'all_admins', 'all');

export const createAdminSchema = Joi.object({
  email: Joi.string().email().max(EMAIL_MAX_LENGTH).required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
  displayName: Joi.string().max(SHORT_TEXT_MAX_LENGTH).min(1).required(),
  adminsCrud: crudSchema.default(0),
  usersCrud: crudSchema.default(0),
  canChangePasswords: Joi.boolean().default(false),
  canAssignPermissions: Joi.boolean().default(false),
  eventVisibility: eventVisibilitySchema.default('own'),
});

export const updateAdminSchema = Joi.object({
  email: Joi.string().email().max(EMAIL_MAX_LENGTH),
  displayName: Joi.string().max(SHORT_TEXT_MAX_LENGTH).min(1),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  adminsCrud: crudSchema,
  usersCrud: crudSchema,
  canChangePasswords: Joi.boolean(),
  canAssignPermissions: Joi.boolean(),
  eventVisibility: eventVisibilitySchema,
}).min(1);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
});

export const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
});
