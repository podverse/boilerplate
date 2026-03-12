import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('Reset-password page in admin_only_email mode.', () => {
  test('When an unauthenticated user visits reset-password with a token, they see the reset form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');

    await actionAndCapture(
      page,
      testInfo,
      'User navigates to reset-password with token and sees the reset form in admin_only_email mode.',
      async () => {
        await page.goto('/reset-password?token=invalid-token-12345');
      }
    );

    await expect(page.getByLabel(/token|paste/i)).toBeVisible();
    await expect(page.getByLabel(/new password/i).first()).toBeVisible();
    await expect(page.getByLabel(/confirm/i).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'Reset-password form is visible in admin_only_email mode.'
    );
  });

  test('When the user submits an invalid token, they see invalid-or-expired-link feedback.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/reset-password?token=invalid-token-12345');
    await page
      .getByLabel(/new password/i)
      .first()
      .fill('Test!1Aa');
    await page
      .getByLabel(/confirm/i)
      .first()
      .fill('Test!1Aa');

    await actionAndCapture(
      page,
      testInfo,
      'User submits reset-password with invalid token and sees invalid-or-expired-link feedback in admin_only_email mode.',
      async () => {
        await page.getByRole('button', { name: /reset password|submit|save/i }).click();
        await expect(page.getByText(/invalid or expired link/i)).toBeVisible();
        await expect(page).toHaveURL(/\/reset-password/);
      }
    );
  });
});
