import Joi from 'joi';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

const password = Joi.string().min(1).max(PASSWORD_MAX_LENGTH).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password,
});

export const changePasswordSchema = Joi.object({
  currentPassword: password,
  newPassword: password,
});

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(1).max(SHORT_TEXT_MAX_LENGTH).required(),
  email: Joi.string().email().max(EMAIL_MAX_LENGTH).optional(),
});
