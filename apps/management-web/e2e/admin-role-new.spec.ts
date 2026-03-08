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

test.describe('Management admin role new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admin-role-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/admins/roles/new');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees add role form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admin-role-new-route-and-expect-add-role-form-visible',
      async () => {
        await page.goto('/admins/roles/new');
      }
    );
    await expect(page).toHaveURL(/\/admins\/roles\/new/);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create|add role/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-admin-role-new-form-visible-with-role-name-and-save'
    );
  });
});
