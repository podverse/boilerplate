/**
 * i18n validate: same keys as en-US, no empty values in en-US originals, overrides match structure.
 * Run from repo root: node scripts/i18n/validate.mjs [appName]
 * If appName omitted, validates both web and management-web.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

function allKeys(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) return [];
  const keys = [];
  for (const key of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys.push(...allKeys(val, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function checkEmptyInEnUs(obj, prefix = '', errors) {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      checkEmptyInEnUs(val, full, errors);
    } else if (val === '' || val === undefined) {
      errors.push(`en-US originals: empty value for "${full}"`);
    }
  }
}

function validateI18nDir(originalsDir, overridesDir, label) {
  if (!fs.existsSync(originalsDir)) {
    return { label, ok: true };
  }
  const enPath = path.join(originalsDir, 'en-US.json');
  if (!fs.existsSync(enPath)) {
    return { label, ok: false, errors: ['en-US.json not found in originals'] };
  }
  const errors = [];
  const enUs = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enUsKeys = new Set(allKeys(enUs));
  checkEmptyInEnUs(enUs, '', errors);

  const localeFiles = fs
    .readdirSync(originalsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));

  for (const locale of localeFiles) {
    if (locale === 'en-US') continue;
    const filePath = path.join(originalsDir, `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = new Set(allKeys(data));
    for (const k of enUsKeys) {
      if (!keys.has(k)) {
        errors.push(`originals/${locale}.json: missing key "${k}" (present in en-US)`);
      }
    }
    for (const k of keys) {
      if (!enUsKeys.has(k)) {
        errors.push(`originals/${locale}.json: extra key "${k}" (not in en-US)`);
      }
    }
  }

  if (fs.existsSync(overridesDir)) {
    const overrideFiles = fs
      .readdirSync(overridesDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
    for (const locale of overrideFiles) {
      const filePath = path.join(overridesDir, `${locale}.json`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const keys = new Set(allKeys(data));
      for (const k of enUsKeys) {
        if (!keys.has(k)) {
          errors.push(`overrides/${locale}.json: missing key "${k}"`);
        }
      }
      for (const k of keys) {
        if (!enUsKeys.has(k)) {
          errors.push(`overrides/${locale}.json: extra key "${k}"`);
        }
      }
    }
  }

  return { label, ok: errors.length === 0, errors };
}

function validateApp(appName) {
  const appDir = path.join(root, 'apps', appName);
  const originalsDir = path.join(appDir, 'i18n', 'originals');
  const overridesDir = path.join(appDir, 'i18n', 'overrides');
  return validateI18nDir(originalsDir, overridesDir, appName);
}

function validateHelpersI18n() {
  const pkgDir = path.join(root, 'packages', 'helpers-i18n');
  const originalsDir = path.join(pkgDir, 'i18n', 'originals');
  const overridesDir = path.join(pkgDir, 'i18n', 'overrides');
  return validateI18nDir(originalsDir, overridesDir, 'helpers-i18n');
}

const appNameArg = process.argv[2];
let failed = false;

if (appNameArg === 'helpers-i18n') {
  const result = validateHelpersI18n();
  if (result.ok) {
    console.warn(`[${result.label}] i18n validate OK`);
  } else {
    failed = true;
    console.error(`[${result.label}] i18n validate failed:`);
    for (const e of result.errors) {
      console.error(`  - ${e}`);
    }
  }
} else {
  const apps = appNameArg ? [appNameArg] : ['web', 'management-web'];
  for (const appName of apps) {
    const result = validateApp(appName);
    if (result.ok) {
      console.warn(`[${result.label}] i18n validate OK`);
    } else {
      failed = true;
      console.error(`[${result.label}] i18n validate failed:`);
      for (const e of result.errors) {
        console.error(`  - ${e}`);
      }
    }
  }
  if (!appNameArg) {
    const result = validateHelpersI18n();
    if (result.ok) {
      console.warn(`[${result.label}] i18n validate OK`);
    } else {
      failed = true;
      console.error(`[${result.label}] i18n validate failed:`);
      for (const e of result.errors) {
        console.error(`  - ${e}`);
      }
    }
  }
}

process.exit(failed ? 1 : 0);
