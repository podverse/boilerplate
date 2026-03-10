import { expect, test } from '@playwright/test';

import { E2E_RESET_PASSWORD_TOKEN_RAW } from './helpers/resetPasswordToken';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const VALID_PASSWORD = 'Test!1Aa';

/** Reset-password-page: valid token→form visible; invalid token→error on submit; valid submit→redirect to login; validation (weak password, mismatch). */

test.describe('This suite verifies the web reset-password-page: form visible with valid token, invalid or expired token shows error, valid new password redirects to login, validation for weak password and mismatch, and log-in link.', () => {
  test('When the user opens the reset-password-page with a valid token in the URL, the reset form is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the reset-password-page with a valid token and sees the form.',
      async () => {
        await page.goto(
          `/reset-password?token=${encodeURIComponent(E2E_RESET_PASSWORD_TOKEN_RAW)}`
        );
      }
    );
    await expect(
      page.getByLabel(/token|paste/i).or(page.getByRole('textbox').first())
    ).toBeVisible();
    await expect(page.getByLabel(/new password/i).first()).toBeVisible();
    await expect(page.getByLabel(/confirm/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /reset password|submit|save/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /log in|back/i })).toBeVisible();
    await expect(page).toHaveURL(/\/reset-password/);
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password form is visible with token, new password, confirm, and submit.'
    );
  });

  test('When the user opens the reset-password-page with an invalid or expired token and submits, an error message is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/reset-password?token=invalid-token-12345');
    await page
      .getByLabel(/new password/i)
      .first()
      .fill(VALID_PASSWORD);
    await page
      .getByLabel(/confirm/i)
      .first()
      .fill(VALID_PASSWORD);

    await actionAndCapture(
      page,
      testInfo,
      'User submits with an invalid token and sees an error message.',
      async () => {
        await page.getByRole('button', { name: /reset password|submit|save/i }).click();
        await expect(
          page.getByText(/Invalid or expired link|invalid|expired|no longer valid/i)
        ).toBeVisible();
        await expect(page).toHaveURL(/\/reset-password/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password-page shows an invalid or expired link message.'
    );
  });

  test('When the user submits a valid new password with a valid token, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/reset-password?token=${encodeURIComponent(E2E_RESET_PASSWORD_TOKEN_RAW)}`);
    await page
      .getByLabel(/new password/i)
      .first()
      .fill(VALID_PASSWORD);
    await page
      .getByLabel(/confirm/i)
      .first()
      .fill(VALID_PASSWORD);

    await actionAndCapture(
      page,
      testInfo,
      'User submits valid new password and is redirected to the login-page.',
      async () => {
        await page.getByRole('button', { name: /reset password|submit|save/i }).click();
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The user is on the login-page after successful password reset.'
    );
  });

  test('When the user submits with a weak password, a validation error is shown and they remain on the reset-password-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/reset-password?token=${encodeURIComponent(E2E_RESET_PASSWORD_TOKEN_RAW)}`);
    await page
      .getByLabel(/new password/i)
      .first()
      .fill('weak');
    await page
      .getByLabel(/confirm/i)
      .first()
      .fill('weak');

    await actionAndCapture(
      page,
      testInfo,
      'User verifies that with a weak password the submit button stays disabled or validation is shown.',
      async () => {
        const submitBtn = page.getByRole('button', { name: /reset password|submit|save/i });
        const disabled = await submitBtn.isDisabled().catch(() => false);
        if (!disabled) {
          await submitBtn.click();
          await expect(
            page.getByText(/password|length|character|uppercase|number|special|requirements/i)
          ).toBeVisible();
        }
        await expect(page).toHaveURL(/\/reset-password/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password-page shows weak-password validation or submit remains disabled.'
    );
  });

  test('When the user submits with a password mismatch, a validation error is shown and they remain on the reset-password-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/reset-password?token=${encodeURIComponent(E2E_RESET_PASSWORD_TOKEN_RAW)}`);
    await page
      .getByLabel(/new password/i)
      .first()
      .fill(VALID_PASSWORD);
    await page
      .getByLabel(/confirm/i)
      .first()
      .fill('OtherPass!1');

    await actionAndCapture(
      page,
      testInfo,
      'User submits with mismatched passwords and sees a validation error.',
      async () => {
        await page.getByRole('button', { name: /reset password|submit|save/i }).click();
        await expect(page.getByText(/Passwords do not match|do not match/i)).toBeVisible();
        await expect(page).toHaveURL(/\/reset-password/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password-page shows password mismatch validation.'
    );
  });

  test('When the user is on the reset-password-page, the log in link is present.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/reset-password?token=some-token`);
    await expect(page.getByRole('link', { name: /log in|back/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the log in link and is navigated to the login-page.',
      async () => {
        await page
          .getByRole('link', { name: /log in|back/i })
          .first()
          .click();
        await expect(page).toHaveURL(/\/login/);
      }
    );
    await capturePageLoad(page, testInfo, 'The login-page is visible.');
  });
});
