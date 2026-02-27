/**
 * Management API startup env validation. Requires MANAGEMENT_* and main DB vars.
 */
import {
  validateJwtSecret,
  validatePositiveInteger,
  validateRequired,
  validateStartupRequirements as validateRequirements,
} from '@boilerplate/helpers';

function managementApiValidationResults() {
  return [
    validatePositiveInteger('MANAGEMENT_API_PORT', 'Management API'),
    validateRequired('MANAGEMENT_APP_NAME', 'Management API'),
    validateJwtSecret('MANAGEMENT_JWT_SECRET', 'Management API'),
    validateRequired('MANAGEMENT_DB_HOST', 'Management DB'),
    validatePositiveInteger('MANAGEMENT_DB_PORT', 'Management DB'),
    validateRequired('MANAGEMENT_DB_NAME', 'Management DB'),
    validateRequired('MANAGEMENT_DB_USERNAME', 'Management DB'),
    validateRequired('MANAGEMENT_DB_PASSWORD', 'Management DB'),
    validateRequired('DB_HOST', 'Main DB'),
    validatePositiveInteger('DB_PORT', 'Main DB'),
    validateRequired('DB_NAME', 'Main DB'),
    validateRequired('DB_READ_WRITE_USERNAME', 'Main DB'),
    validateRequired('DB_READ_WRITE_PASSWORD', 'Main DB'),
  ];
}

export const validateStartupRequirements = (): void => {
  validateRequirements(managementApiValidationResults());
};
