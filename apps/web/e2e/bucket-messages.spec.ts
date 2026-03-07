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

test.describe('Bucket messages', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-messages-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees messages list or empty state', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-messages-expect-list-or-empty-state',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`));
    await expect(
      page
        .getByRole('heading', { name: /messages/i })
        .or(page.getByText(/no messages|empty|add message/i))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'bucket-messages-page-visible-with-list-or-empty-state');
  });
});
