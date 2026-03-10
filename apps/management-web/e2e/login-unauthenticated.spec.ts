import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';

test.describe('This suite verifies the management login-page for the unauthenticated user.', () => {
  test('When an unauthenticated user visits the login-page, they see the login-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management login-page and sees the login-form with username field.',
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
      'The management login-form is fully visible with username, password, and submit button.'
    );
  });

  test('When the user submits invalid credentials, an error is shown and they remain on the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User fills a wrong password and submits; an error message is shown.',
      async () => {
        await page.goto('/login');
        await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
        await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
        await page.getByLabel(/password/i).fill('WrongPassword1!');
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect.poll(() => new URL(page.url()).pathname, { timeout: 10000 }).toBe('/login');
        await expect(page.getByText(/invalid credentials/i)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The login-page is still visible with an error message after invalid credentials.'
    );
  });
});
