import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SHORT_TEXT_MAX_LENGTH,
} from '@boilerplate/helpers';
import Joi from 'joi';

export type {
  ChangeUserPasswordBody,
  CreateUserBody,
  UpdateUserBody,
} from '@boilerplate/helpers-requests';

export const createUserSchema = Joi.object({
  email: Joi.string().email().max(EMAIL_MAX_LENGTH).required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
  displayName: Joi.string().max(SHORT_TEXT_MAX_LENGTH).allow(null, ''),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().max(EMAIL_MAX_LENGTH),
  displayName: Joi.string().max(SHORT_TEXT_MAX_LENGTH).allow(null, ''),
}).min(1);

export const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
});
