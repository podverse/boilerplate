/**
 * API startup env validation. Delegates to @boilerplate/helpers.
 * Requires DB_READ_* and DB_READ_WRITE_* when using database (ORM).
 * Requires JWT_SECRET (min length 32, must not be a weak/predictable value).
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

function resolveAuthMode(): string | undefined {
  const value = process.env.AUTH_MODE;
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === '' ? undefined : normalized;
}

function authModeUsesEmailFlows(authMode: string | undefined): boolean {
  return authMode === AUTH_MODE_ADMIN_ONLY_EMAIL || authMode === AUTH_MODE_USER_SIGNUP_EMAIL;
}

function validateOptionalUnset(name: string, category: string): ValidationResult {
  const value = process.env[name];
  const isSet = value !== undefined && value !== null && value !== '';
  return {
    name,
    isSet,
    isValid: !isSet,
    isRequired: false,
    message: isSet
      ? `Set unexpectedly for AUTH_MODE=${AUTH_MODE_ADMIN_ONLY_USERNAME}; unset ${name}`
      : 'Not set',
    category,
  };
}

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

function apiValidationResults(): ValidationResult[] {
  const results: ValidationResult[] = [
    validateAuthMode(),
    validatePositiveInteger('API_PORT', 'API'),
    validateRequired('APP_NAME', 'API'),
    validateJwtSecret('JWT_SECRET', 'API'),
    validateRequired('SESSION_COOKIE_NAME', 'Session cookies'),
    validateRequired('REFRESH_COOKIE_NAME', 'Session cookies'),
    validatePositiveInteger('JWT_ACCESS_EXPIRY_SECONDS', 'Session cookies'),
    validatePositiveInteger('JWT_REFRESH_EXPIRY_SECONDS', 'Session cookies'),
    validateRequired('COOKIE_SAME_SITE', 'Session cookies'),
    validateRequired('DB_HOST', 'Database'),
    validatePositiveInteger('DB_PORT', 'Database'),
    validateRequired('DB_NAME', 'Database'),
    validateRequired('DB_READ_USERNAME', 'Database'),
    validateRequired('DB_READ_PASSWORD', 'Database'),
    validateRequired('DB_READ_WRITE_USERNAME', 'Database'),
    validateRequired('DB_READ_WRITE_PASSWORD', 'Database'),
    validateRequired('VALKEY_PASSWORD', 'Valkey'),
  ];
  const authMode = resolveAuthMode();
  if (authModeUsesEmailFlows(authMode)) {
    results.push(
      validateRequired('SMTP_HOST', 'Mailer'),
      validateRequired('SMTP_PORT', 'Mailer'),
      validateRequired('MAIL_FROM', 'Mailer'),
      validateRequired('APP_BASE_URL', 'Mailer')
    );
  } else if (authMode === AUTH_MODE_ADMIN_ONLY_USERNAME) {
    results.push(
      validateOptionalUnset('SMTP_HOST', 'Mailer'),
      validateOptionalUnset('SMTP_PORT', 'Mailer'),
      validateOptionalUnset('MAIL_FROM', 'Mailer'),
      validateOptionalUnset('APP_BASE_URL', 'Mailer')
    );
  }
  return results;
}

export const validateStartupRequirements = (): void => {
  validateRequirements(apiValidationResults());
};
