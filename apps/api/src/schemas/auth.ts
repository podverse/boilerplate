import Joi from 'joi';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  SHORT_TEXT_MAX_LENGTH,
} from '@boilerplate/helpers';

const email = Joi.string().email().max(EMAIL_MAX_LENGTH).required();
const password = Joi.string().min(1).max(PASSWORD_MAX_LENGTH).required();

export const loginSchema = Joi.object({
  email,
  password,
});

export const signupSchema = Joi.object({
  email,
  password,
  displayName: Joi.string().max(SHORT_TEXT_MAX_LENGTH).allow(null, ''),
});

export const changePasswordSchema = Joi.object({
  currentPassword: password,
  newPassword: password,
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().min(1).required(),
}).options({ allowUnknown: true });

export const forgotPasswordSchema = Joi.object({
  email,
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().min(1).required(),
  newPassword: password,
});

export const requestEmailChangeSchema = Joi.object({
  newEmail: email,
});

export const confirmEmailChangeSchema = Joi.object({
  token: Joi.string().min(1).required(),
}).options({ allowUnknown: true });
