import Joi from 'joi';

const crudSchema = Joi.number().integer().min(0).max(15);
const eventVisibilitySchema = Joi.string().valid('own', 'all_admins', 'all');

export const createAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  displayName: Joi.string().max(50).allow(null, ''),
  adminsCrud: crudSchema.default(0),
  usersCrud: crudSchema.default(0),
  canChangePasswords: Joi.boolean().default(false),
  canAssignPermissions: Joi.boolean().default(false),
  eventVisibility: eventVisibilitySchema.default('own'),
});

export const updateAdminSchema = Joi.object({
  email: Joi.string().email(),
  displayName: Joi.string().max(50).allow(null, ''),
  password: Joi.string().min(8),
  adminsCrud: crudSchema,
  usersCrud: crudSchema,
  canChangePasswords: Joi.boolean(),
  canAssignPermissions: Joi.boolean(),
  eventVisibility: eventVisibilitySchema,
}).min(1);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required(),
});
