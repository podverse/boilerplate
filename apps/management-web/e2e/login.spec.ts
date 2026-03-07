import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';

test.describe('Login', () => {
  test('shows login form when unauthenticated', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-login-page-and-expect-form-visible-with-username-field',
      async () => {
        await page.goto('/login');
      }
    );
    await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-login-form-fully-visible-with-username-password-and-submit'
    );
  });

  test('valid credentials redirect to dashboard', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'fill-username-and-password-with-seeded-super-admin-then-submit',
      async () => {
        await page.goto('/login');
        await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'management-dashboard-visible-after-successful-login-with-super-admin'
    );
  });

  test('invalid credentials show error and do not redirect', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'fill-wrong-password-and-submit-expect-error-message',
      async () => {
        await page.goto('/login');
        await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
        await page.getByLabel(/password/i).fill('WrongPassword1!');
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole('alert').or(page.getByText(/invalid|incorrect|wrong|error/i))
    ).toBeVisible();
  });
});
