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

test.describe('Bucket role edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-role-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('invalid role id shows not found', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-role-edit-with-invalid-role-id-and-expect-not-found',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
    await expect(page.getByText(/not found|404/i)).toBeVisible();
    await capturePageLoad(page, testInfo, 'bucket-role-edit-invalid-role-id-renders-not-found');
  });
});
