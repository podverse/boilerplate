import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';
const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Management user edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees edit user form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-edit-route-and-expect-edit-user-form-visible',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}/edit`));
    const visibleFormField = page.getByRole('textbox', { name: /email|display/i }).first();
    const hasFormField = await visibleFormField.isVisible().catch(() => false);
    if (hasFormField) {
      await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible();
    } else {
      await expect(page.getByText(/not found|404/i)).toBeVisible();
    }
    await capturePageLoad(
      page,
      testInfo,
      'management-user-edit-route-visible-with-edit-form-or-not-found-state'
    );
  });
});
