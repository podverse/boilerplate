/* eslint-disable no-console -- startup validation output to console */

/**
 * Validates required environment variables at API startup.
 * Pattern aligned with Podverse monorepo (lib/startup/validation.ts) but minimal for placeholder vars.
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

function validateRequired(varName: string, category: string): ValidationResult {
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

function validateApiPort(): ValidationResult {
  const varName = 'API_PORT';
  const category = 'API';
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

function validateAll(): ValidationSummary {
  const results: ValidationResult[] = [
    validateApiPort(),
    validateRequired('APP_NAME', 'API'),
  ];
  const total = results.length;
  const passed = results.filter((r) => r.isValid && r.isSet).length;
  const failed = results.filter((r) => !r.isValid).length;
  const requiredMissing = results.filter((r) => r.isRequired && !r.isValid).length;
  return { total, passed, failed, requiredMissing, results };
}

function displayValidationResults(summary: ValidationSummary): void {
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
 * Validates required env vars at startup. Call after loadEnv(), before importing config.
 * @throws Error if any required variable is missing or invalid
 */
export const validateStartupRequirements = (): void => {
  const summary = validateAll();
  displayValidationResults(summary);
  if (summary.requiredMissing > 0) {
    throw new Error(
      `FATAL: ${summary.requiredMissing} required environment variable(s) are missing or invalid. Please check the validation output above for details.`
    );
  }
  console.log('Startup validation completed successfully.');
};
