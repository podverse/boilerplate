import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * E2E: unauthenticated redirect from /dashboard; authenticated user sees dashboard.
 * Requires e2e seed (e2e-superadmin / Test!1Aa) and management-api + management-web running.
 */
test.describe('This suite verifies the management dashboard-page: unauthenticated redirect to login-page and authenticated user sees dashboard after login.', () => {
  test('When an unauthenticated user visits the dashboard-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User visits the dashboard-page while unauthenticated and is redirected to the login-page.',
      async () => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The login-page is visible after unauthenticated user is redirected from the dashboard-page.'
    );
  });

  test('When the user logs in with the seeded-super-admin account, the dashboard-page loads and shows the dashboard heading.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management login-page before authenticating with the seeded-super-admin.',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management login-page is fully rendered before entering super-admin credentials.'
    );
    await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User fills the username field with the seeded-super-admin identity.',
      async () => {
        await page.getByRole('textbox', { name: /username|email/i }).fill('e2e-superadmin');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User fills the password field with the seeded-super-admin secret.',
      async () => {
        await page.getByLabel(/password/i).fill('Test!1Aa');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User submits the management login-form and is transitioned to the dashboard after successful authentication.',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management dashboard-page is visible with the primary heading after successful login.'
    );
  });
});
