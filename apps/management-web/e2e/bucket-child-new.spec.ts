import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Management bucket child new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-child-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees child bucket create form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-child-new-route-and-expect-create-form-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create topic|create|save|add bucket/i })
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-bucket-child-new-form-visible-with-name-and-submit'
    );
  });
});
