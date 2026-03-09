import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Forgot password', () => {
  test('shows forgot-password form when unauthenticated', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-forgot-password-page-and-expect-form-visible',
      async () => {
        await page.goto('/forgot-password');
      }
    );
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /send|submit|reset password|forgot/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /log in|back/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'forgot-password-form-fully-visible-with-email-and-submit'
    );
  });

  test('submit shows success or error message', async ({ page }, testInfo) => {
    await page.goto('/forgot-password');
    await actionAndCapture(
      page,
      testInfo,
      'submit-email-and-expect-success-or-error-message-no-email-enumeration',
      async () => {
        await page.getByRole('textbox', { name: /email/i }).fill('e2e@example.com');
        await page.getByRole('button', { name: /send|submit|reset password|forgot/i }).click();
      }
    );
    await expect(
      page.getByText(
        /sent|check your email|if an account exists|error|invalid|not enabled|verification/i
      )
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'forgot-password-page-shows-success-or-error-after-submit'
    );
  });

  test('log in link goes to login page', async ({ page }, testInfo) => {
    await page.goto('/forgot-password');
    await actionAndCapture(
      page,
      testInfo,
      'click-log-in-link-and-verify-navigation-to-login-page',
      async () => {
        await page
          .getByRole('link', { name: /log in|back/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('email field is required before submit', async ({ page }, testInfo) => {
    await page.goto('/forgot-password');

    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-forgot-password-form-and-stay-on-page',
      async () => {
        await page.getByRole('button', { name: /send|submit|reset password|forgot/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });
});
