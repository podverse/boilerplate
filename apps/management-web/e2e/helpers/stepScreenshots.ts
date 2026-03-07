import type { Page, TestInfo } from '@playwright/test';

const stepCounters = new WeakMap<TestInfo, number>();
const MAX_IMAGE_ATTACH_NAME_LENGTH = 60;

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

const truncate = (s: string, maxLen: number): string => {
  const t = s.trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen);
};

/** Full step description for the text attachment (test context + label). */
const buildFullDescription = (testInfo: TestInfo, label: string): string => {
  const context = testInfo.titlePath.filter((segment) => segment.trim().length > 0).join(' ');
  const labelPart = label.trim();
  return context ? `${context} – ${labelPart}` : labelPart;
};

const captureStep = async (page: Page, testInfo: TestInfo, label: string): Promise<void> => {
  if (!isStepScreenshotsEnabled()) {
    return;
  }
  const stepIndex = nextStepIndex(testInfo);
  const shortFileName = `step-${String(stepIndex).padStart(3, '0')}.png`;
  const screenshotPath = testInfo.outputPath(shortFileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const fullLabel = buildFullDescription(testInfo, label);
  const shortCaption = truncate(label, MAX_IMAGE_ATTACH_NAME_LENGTH);
  const imageAttachName = shortCaption ? `Step ${stepIndex}: ${shortCaption}` : `Step ${stepIndex}`;

  await testInfo.attach(imageAttachName, {
    path: screenshotPath,
    contentType: 'image/png',
  });
  await testInfo.attach('Step description', {
    body: fullLabel,
    contentType: 'text/plain',
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
