import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Management buckets new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees add bucket form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-new-route-and-expect-add-bucket-form-visible',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-add-bucket-form-visible-with-name-and-submit'
    );
  });
});
