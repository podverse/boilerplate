import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';
/** UUID from tools/web/seed-e2e.mjs E2E_BUCKET1_ID (main DB; management E2E runs after full seed). */
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Bucket detail', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-detail-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees bucket detail with tabs or messages', async ({
    page,
  }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-detail-expect-tabs-or-messages',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    await expect(
      page.getByText(/E2E Bucket One/).or(page.getByRole('tab', { name: /messages|topics/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-bucket-detail-visible-with-name-or-tabs');
  });
});
