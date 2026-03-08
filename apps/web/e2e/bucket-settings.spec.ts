import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Bucket settings', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-settings-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees bucket settings page', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-settings-expect-settings-form-or-admins-section',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings`));
    await expect(page.getByRole('heading', { name: /settings|bucket/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /general/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /admins/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /roles/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-settings-page-visible-with-save-button-or-settings-heading'
    );
  });

  test('bucket settings admins tab url is reachable', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-settings-admins-tab-and-expect-admins-context-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=admins`);
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=admins`)
    );
    await expect(page.getByText(/admins/i).first()).toBeVisible();
  });
});
