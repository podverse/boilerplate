/**
 * Management API startup env validation. Requires MANAGEMENT_* and main DB vars.
 */
import type { ValidationResult } from '@boilerplate/helpers';

import {
  getEffectiveUserAgent,
  validateAuthMode as validateAuthModeEnv,
  validateJwtSecret,
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

function validateAuthMode(): ValidationResult {
  return validateAuthModeEnv('AUTH_MODE', 'Auth');
}

const USER_AGENT_PATTERN = /^[^/]+\/[^/]+\/[^/]+$/;
const USER_AGENT_SUFFIX = ' Bot Local/Management-API/1';

/**
 * Validates USER_AGENT (or effective value when blank, built from BRAND_NAME).
 * Format: BrandName Bot Environment/AppName/Version, e.g. "Boilerplate Bot Local/Management-API/1"
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

function managementApiValidationResults() {
  return [
    validateAuthMode(),
    validatePositiveInteger('MANAGEMENT_API_PORT', 'Management API'),
    validateRequired('BRAND_NAME', 'Management API'),
    validateUserAgent(),
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
