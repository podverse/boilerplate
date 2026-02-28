/**
 * API startup env validation. Delegates to @boilerplate/helpers.
 * Requires DB_READ_* and DB_READ_WRITE_* when using database (ORM).
 * Requires JWT_SECRET (min length 32, must not be a weak/predictable value).
 */
import {
  validateJwtSecret,
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

function apiValidationResults() {
  const results = [
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
  if (process.env.MAILER_ENABLED === 'true') {
    results.push(
      validateRequired('SMTP_HOST', 'Mailer'),
      validateRequired('SMTP_PORT', 'Mailer'),
      validateRequired('MAIL_FROM', 'Mailer'),
      validateRequired('APP_BASE_URL', 'Mailer')
    );
  }
  return results;
}

export const validateStartupRequirements = (): void => {
  validateRequirements(apiValidationResults());
};
