/**
 * API startup env validation. Delegates to @boilerplate/helpers.
 * Requires DB_READ_* and DB_READ_WRITE_* when using database (ORM).
 */
import {
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

function apiValidationResults() {
  return [
    validatePositiveInteger('API_PORT', 'API'),
    validateRequired('APP_NAME', 'API'),
    validateRequired('DB_HOST', 'Database'),
    validatePositiveInteger('DB_PORT', 'Database'),
    validateRequired('DB_NAME', 'Database'),
    validateRequired('DB_READ_USERNAME', 'Database'),
    validateRequired('DB_READ_PASSWORD', 'Database'),
    validateRequired('DB_READ_WRITE_USERNAME', 'Database'),
    validateRequired('DB_READ_WRITE_PASSWORD', 'Database'),
  ];
}

export const validateStartupRequirements = (): void => {
  validateRequirements(apiValidationResults());
};
