import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  displayName: Joi.string().max(50).allow(null, ''),
  profileVisibility: Joi.boolean().default(false),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  displayName: Joi.string().max(50).allow(null, ''),
  profileVisibility: Joi.boolean(),
}).min(1);

export const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required(),
});
