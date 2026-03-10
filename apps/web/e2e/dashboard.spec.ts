import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * E2E: unauthenticated redirect from /dashboard; authenticated user sees dashboard.
 * Requires e2e seed (e2e@example.com / Test!1Aa) and API + web running.
 */
test.describe('This suite verifies the dashboard-page after login and unauthenticated redirect.', () => {
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
        await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The login-page is visible after unauthenticated user is redirected from the dashboard-page.'
    );
  });

  test('When the user logs in with the seeded E2E account, the dashboard-page loads and shows the dashboard heading.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the login-page before authenticating with the seeded E2E user.',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The login-page is fully rendered before entering credentials.'
    );
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User fills the email or username field with the seeded E2E user identity.',
      async () => {
        await page.getByLabel(/email/i).fill('e2e@example.com');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User fills the password field with the seeded E2E user secret.',
      async () => {
        await page.getByLabel(/password/i).fill('Test!1Aa');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User submits the login-form and is transitioned to the dashboard after successful authentication.',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The dashboard-page is visible with the primary heading after successful login.'
    );
  });
});
