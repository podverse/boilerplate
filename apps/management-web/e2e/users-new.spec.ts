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

test.describe('Management users new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/users/new');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees add user form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-new-route-and-expect-add-user-form-visible',
      async () => {
        await page.goto('/users/new');
      }
    );
    await expect(page).toHaveURL(/\/users\/new/);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add user|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-add-user-form-visible-with-credentials-fields'
    );
  });
});
