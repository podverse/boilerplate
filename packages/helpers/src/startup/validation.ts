/* eslint-disable no-console -- startup validation output to console */

/**
 * Shared startup environment validation. Used by API and web-sidecar.
 * Pattern aligned with Podverse monorepo (helpers-config / lib/startup/validation).
 */

export type ValidationResult = {
  name: string;
  isSet: boolean;
  isValid: boolean;
  isRequired: boolean;
  message: string;
  category: string;
};

export type ValidationSummary = {
  total: number;
  passed: number;
  failed: number;
  requiredMissing: number;
  results: ValidationResult[];
};

/**
 * Validates that an env var is set and non-empty.
 */
export function validateRequired(varName: string, category: string): ValidationResult {
  const value = process.env[varName];
  const isSet =
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '';
  return {
    name: varName,
    isSet,
    isValid: isSet,
    isRequired: true,
    message: isSet ? 'Set' : 'Missing or empty',
    category,
  };
}

/**
 * Validates that an env var is set and a positive integer (e.g. API_PORT, PORT).
 */
export function validatePositiveInteger(varName: string, category: string): ValidationResult {
  const value = process.env[varName];
  const isSet =
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '';
  if (!isSet) {
    return {
      name: varName,
      isSet: false,
      isValid: false,
      isRequired: true,
      message: 'Missing - must be a positive integer',
      category,
    };
  }
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num <= 0) {
    return {
      name: varName,
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Invalid: "${value}" - must be a positive integer`,
      category,
    };
  }
  return {
    name: varName,
    isSet: true,
    isValid: true,
    isRequired: true,
    message: `Set to ${value}`,
    category,
  };
}

const DEFAULT_WEAK_JWT_SECRETS = [
  'secret',
  'jwt_secret',
  'change-me',
  'changeme',
  'change-me-in-production',
  'your-256-bit-secret',
  'supersecret',
];

/**
 * Validates that an env var is set and suitable for use as a JWT secret:
 * - Non-empty
 * - Minimum length (default 32 for HS256)
 * - Not a known weak value
 */
export function validateJwtSecret(
  varName: string,
  category: string,
  options: { minLength?: number; weakValues?: string[] } = {}
): ValidationResult {
  const { minLength = 32, weakValues = DEFAULT_WEAK_JWT_SECRETS } = options;
  const value = process.env[varName];
  const isSet =
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '';
  if (!isSet) {
    return {
      name: varName,
      isSet: false,
      isValid: false,
      isRequired: true,
      message: 'Missing or empty',
      category,
    };
  }
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return {
      name: varName,
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Too short: must be at least ${minLength} characters for sufficient entropy`,
      category,
    };
  }
  const lower = trimmed.toLowerCase();
  const isWeak = weakValues.some((w) => lower.includes(w) || w === lower);
  if (isWeak) {
    return {
      name: varName,
      isSet: true,
      isValid: false,
      isRequired: true,
      message: 'Value is too weak or predictable; use a long random string',
      category,
    };
  }
  return {
    name: varName,
    isSet: true,
    isValid: true,
    isRequired: true,
    message: 'Set (length and strength OK)',
    category,
  };
}

/**
 * Builds a ValidationSummary from an array of results.
 */
export function buildSummary(results: ValidationResult[]): ValidationSummary {
  const total = results.length;
  const passed = results.filter((r) => r.isValid && r.isSet).length;
  const failed = results.filter((r) => !r.isValid).length;
  const requiredMissing = results.filter((r) => r.isRequired && !r.isValid).length;
  return { total, passed, failed, requiredMissing, results };
}

/**
 * Logs validation results to console, then throws if any required var is missing/invalid.
 */
export function displayValidationResults(summary: ValidationSummary): void {
  console.log('=== Environment Variable Validation ===');
  const byCategory = summary.results.reduce<Record<string, ValidationResult[]>>((acc, r) => {
    const cat = r.category;
    if (acc[cat] === undefined) {
      acc[cat] = [];
    }
    acc[cat].push(r);
    return acc;
  }, {});
  for (const category of Object.keys(byCategory).sort()) {
    console.log(`[${category}]`);
    const list = byCategory[category] ?? [];
    for (const r of list) {
      const status = r.isValid ? '✓' : '✗';
      const reqLabel = r.isRequired ? '' : ' (optional)';
      const line = `  ${status} ${r.name}${reqLabel} - ${r.message}`;
      if (!r.isValid) {
        console.error(line);
      } else {
        console.log(line);
      }
    }
  }
  console.log('=== Validation Summary ===');
  console.log(`Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}`);
  console.log(`Required missing: ${summary.requiredMissing}`);
  if (summary.requiredMissing > 0) {
    console.error(
      'FATAL: Required environment variable(s) missing or invalid. Check output above.'
    );
  }
}

/**
 * Runs validation: builds summary from results, displays, throws if any required var missing/invalid.
 * Call after loadEnv(), before importing config.
 */
export function validateStartupRequirements(results: ValidationResult[]): void {
  const summary = buildSummary(results);
  displayValidationResults(summary);
  if (summary.requiredMissing > 0) {
    throw new Error(
      `FATAL: ${summary.requiredMissing} required environment variable(s) are missing or invalid. Please check the validation output above for details.`
    );
  }
  console.log('Startup validation completed successfully.');
}
