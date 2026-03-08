import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Profile', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-profile-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees profile or identity', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-profile-expect-profile-content-or-display-name',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page.getByText(/e2e user/i)).toBeVisible();
    await capturePageLoad(page, testInfo, 'profile-page-visible-with-user-identity-or-heading');
  });
});
