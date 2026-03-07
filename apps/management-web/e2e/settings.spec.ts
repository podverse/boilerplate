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

test.describe('Settings', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-settings-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees settings page with tabs or form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-settings-expect-tabs-or-sections',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(
      page
        .getByRole('tab', { name: /profile|password|account/i })
        .or(page.getByRole('heading', { name: /settings|account/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-settings-page-visible-with-tabs-or-heading');
  });
});
