/**
 * API startup env validation. Delegates to @boilerplate/helpers.
 * Requires DB_READ_* and DB_READ_WRITE_* when using database (ORM).
 * Requires JWT_SECRET (min length 32, must not be a weak/predictable value).
 */
import type { ValidationResult } from '@boilerplate/helpers';

import {
  AUTH_MODE_ADMIN_ONLY_EMAIL,
  AUTH_MODE_ADMIN_ONLY_USERNAME,
  AUTH_MODE_USER_SIGNUP_EMAIL,
  getEffectiveUserAgent,
  normalizedAuthMode,
  validateAuthMode as validateAuthModeEnv,
  validateJwtSecret,
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

function resolveAuthMode(): string | undefined {
  return normalizedAuthMode(process.env.AUTH_MODE);
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
  return validateAuthModeEnv('AUTH_MODE', 'Auth');
}

const USER_AGENT_PATTERN = /^[^/]+\/[^/]+\/[^/]+$/;
const USER_AGENT_SUFFIX = ' Bot Local/API/1';

/**
 * Validates USER_AGENT (or effective value when blank, built from BRAND_NAME).
 * Format: BrandName Bot Environment/AppName/Version, e.g. "Boilerplate Bot Local/API/1"
 */
function validateUserAgent(): ValidationResult {
  const brandName = process.env.BRAND_NAME;
  if (brandName === undefined || brandName === null || brandName.trim() === '') {
    return {
      name: 'USER_AGENT',
      isSet: false,
      isValid: false,
      isRequired: true,
      message: 'BRAND_NAME required to validate USER_AGENT',
      category: 'Auth & Security',
    };
  }
  const effectiveUserAgent = getEffectiveUserAgent({
    userAgentRaw: process.env.USER_AGENT,
    brandName,
    suffix: USER_AGENT_SUFFIX,
  });

  if (!USER_AGENT_PATTERN.test(effectiveUserAgent)) {
    return {
      name: 'USER_AGENT',
      isSet: process.env.USER_AGENT?.trim() !== '',
      isValid: false,
      isRequired: true,
      message: `Invalid format: "${effectiveUserAgent}" - must follow format: BrandName Bot Environment/AppName/Version`,
      category: 'Auth & Security',
    };
  }

  const firstPart = effectiveUserAgent.split('/')[0];
  if (firstPart && !firstPart.includes('Bot')) {
    return {
      name: 'USER_AGENT',
      isSet: process.env.USER_AGENT?.trim() !== '',
      isValid: false,
      isRequired: true,
      message: `Missing "Bot" in first part: "${effectiveUserAgent}"`,
      category: 'Auth & Security',
    };
  }

  return {
    name: 'USER_AGENT',
    isSet: true,
    isValid: true,
    isRequired: true,
    message: 'Valid format',
    category: 'Auth & Security',
  };
}

function apiValidationResults(): ValidationResult[] {
  const results: ValidationResult[] = [
    validateAuthMode(),
    validatePositiveInteger('API_PORT', 'API'),
    validateRequired('BRAND_NAME', 'API'),
    validateUserAgent(),
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
