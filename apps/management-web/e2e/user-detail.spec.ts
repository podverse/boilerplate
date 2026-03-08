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

test.describe('Management user detail', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-detail-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees seeded user detail', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-detail-route-and-expect-seeded-user-fields-visible',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}`));
    await expect(page.getByText(/e2e@example.com|view user|email/i).first()).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-user-detail-visible-with-seeded-user-email');
  });

  test('invalid user id shows not found', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-detail-with-invalid-user-id-and-expect-not-found',
      async () => {
        await page.goto('/user/99999999-9999-4999-a999-999999999999');
      }
    );
    await expect(page.getByText(/not found|404/i)).toBeVisible();
  });
});
