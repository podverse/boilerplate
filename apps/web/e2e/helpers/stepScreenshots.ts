import type { Page, TestInfo } from '@playwright/test';

const stepCounters = new WeakMap<TestInfo, number>();
const MAX_FILE_LABEL_LENGTH = 220;

const isStepScreenshotsEnabled = (): boolean => {
  const raw = process.env.E2E_STEP_SCREENSHOTS;
  if (raw === undefined) {
    return false;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const nextStepIndex = (testInfo: TestInfo): number => {
  const current = stepCounters.get(testInfo) ?? 0;
  const next = current + 1;
  stepCounters.set(testInfo, next);
  return next;
};

const sanitizeLabel = (label: string): string =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'step';

const buildTestContextLabel = (testInfo: TestInfo): string => {
  const context = testInfo.titlePath.filter((segment) => segment.trim().length > 0).join(' ');
  const sanitized = sanitizeLabel(context);
  if (sanitized.length <= MAX_FILE_LABEL_LENGTH) {
    return sanitized;
  }
  return sanitized.slice(0, MAX_FILE_LABEL_LENGTH);
};

const captureStep = async (page: Page, testInfo: TestInfo, label: string): Promise<void> => {
  if (!isStepScreenshotsEnabled()) {
    return;
  }
  const stepIndex = nextStepIndex(testInfo);
  const testContextLabel = buildTestContextLabel(testInfo);
  const stepLabel = `${String(stepIndex).padStart(3, '0')}-${testContextLabel}-${sanitizeLabel(label)}`;
  const screenshotPath = testInfo.outputPath(`${stepLabel}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(stepLabel, {
    path: screenshotPath,
    contentType: 'image/png',
  });
};

export const capturePageLoad = async (
  page: Page,
  testInfo: TestInfo,
  label = 'page-load'
): Promise<void> => {
  await captureStep(page, testInfo, label);
};

export const actionAndCapture = async (
  page: Page,
  testInfo: TestInfo,
  label: string,
  action: () => Promise<void>
): Promise<void> => {
  await action();
  await captureStep(page, testInfo, label);
};
