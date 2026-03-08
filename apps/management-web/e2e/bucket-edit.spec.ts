import { expect, test } from '@playwright/test';

import { actionAndCapture } from './helpers/stepScreenshots';

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

test.describe('Management bucket edit redirect', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user is redirected from edit route to settings route', async ({
    page,
  }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-bucket-edit-route-and-expect-redirect-to-settings',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings`));
  });
});
