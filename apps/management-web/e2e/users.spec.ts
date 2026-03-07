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

test.describe('Users list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/users');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees users list or add-user CTA', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-expect-list-or-add-user-cta',
      async () => {
        await page.goto('/users');
      }
    );
    await expect(page).toHaveURL(/\/users/);
    await expect(
      page
        .getByRole('link', { name: /add user|new user|create/i })
        .or(page.getByRole('heading', { name: /users/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-users-page-visible-with-list-or-add-cta');
  });
});
