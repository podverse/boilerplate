/**
 * Management API startup env validation. Requires MANAGEMENT_* and main DB vars.
 */
import type { ValidationResult } from '@boilerplate/helpers';
import {
  validateJwtSecret,
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

const AUTH_MODE_ADMIN_ONLY_USERNAME = 'admin_only_username';
const AUTH_MODE_ADMIN_ONLY_EMAIL = 'admin_only_email';
const AUTH_MODE_USER_SIGNUP_EMAIL = 'user_signup_email';
const AUTH_MODE_ALLOWED = [
  AUTH_MODE_ADMIN_ONLY_USERNAME,
  AUTH_MODE_ADMIN_ONLY_EMAIL,
  AUTH_MODE_USER_SIGNUP_EMAIL,
] as const;

function validateAuthMode(): ValidationResult {
  const value = process.env.AUTH_MODE;
  const isSet =
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '';
  if (!isSet) {
    return {
      name: 'AUTH_MODE',
      isSet: false,
      isValid: false,
      isRequired: true,
      message:
        'Missing - must be set to admin_only_username, admin_only_email, or user_signup_email',
      category: 'Auth',
    };
  }
  const normalized = value.trim().toLowerCase();
  const allowed = AUTH_MODE_ALLOWED.some((mode) => mode === normalized);
  return {
    name: 'AUTH_MODE',
    isSet: true,
    isValid: allowed,
    isRequired: true,
    message: allowed
      ? `Set to ${value}`
      : `Invalid: "${value}" - AUTH_MODE must be set to admin_only_username, admin_only_email, or user_signup_email`,
    category: 'Auth',
  };
}

function managementApiValidationResults() {
  return [
    validateAuthMode(),
    validatePositiveInteger('MANAGEMENT_API_PORT', 'Management API'),
    validateRequired('MANAGEMENT_APP_NAME', 'Management API'),
    validateJwtSecret('MANAGEMENT_JWT_SECRET', 'Management API'),
    validateRequired('MANAGEMENT_SESSION_COOKIE_NAME', 'Management session cookies'),
    validateRequired('MANAGEMENT_REFRESH_COOKIE_NAME', 'Management session cookies'),
    validatePositiveInteger('MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS', 'Management session cookies'),
    validatePositiveInteger('MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS', 'Management session cookies'),
    validatePositiveInteger('USER_INVITATION_TTL_HOURS', 'Management users'),
    validateRequired('MANAGEMENT_COOKIE_SAME_SITE', 'Management session cookies'),
    validateRequired('MANAGEMENT_DB_HOST', 'Management DB'),
    validatePositiveInteger('MANAGEMENT_DB_PORT', 'Management DB'),
    validateRequired('MANAGEMENT_DB_NAME', 'Management DB'),
    validateRequired('MANAGEMENT_DB_USERNAME', 'Management DB'),
    validateRequired('MANAGEMENT_DB_PASSWORD', 'Management DB'),
    validateRequired('DB_HOST', 'Main DB'),
    validatePositiveInteger('DB_PORT', 'Main DB'),
    validateRequired('DB_NAME', 'Main DB'),
    validateRequired('DB_READ_USERNAME', 'Main DB'),
    validateRequired('DB_READ_PASSWORD', 'Main DB'),
    validateRequired('DB_READ_WRITE_USERNAME', 'Main DB'),
    validateRequired('DB_READ_WRITE_PASSWORD', 'Main DB'),
  ];
}

export const validateStartupRequirements = (): void => {
  validateRequirements(managementApiValidationResults());
};
