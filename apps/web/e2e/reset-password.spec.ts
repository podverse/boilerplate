import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the reset-password page.', () => {
  test('When the user opens the reset-password page with an invalid token, an error message is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the reset-password page with an invalid token and sees an error.',
      async () => {
        await page.goto('/reset-password?token=invalid-token-12345');
        await expect(
          page.getByRole('alert').or(page.getByText(/invalid|expired|not found|no longer valid/i))
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password page shows an invalid or expired link message.'
    );
  });

  test('When the user opens the reset-password page without a token, they see a form or token-required state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the reset-password page without a token and sees form or error.',
      async () => {
        await page.goto('/reset-password');
        const hasError = await page
          .getByText(/invalid|expired|token|required/i)
          .first()
          .isVisible()
          .catch(() => false);
        const hasForm =
          (await page
            .getByLabel(/new password|password/i)
            .first()
            .isVisible()
            .catch(() => false)) ||
          (await page
            .getByRole('button', { name: /reset|submit|save/i })
            .isVisible()
            .catch(() => false));
        expect(hasError || hasForm).toBe(true);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The reset-password page shows token-required or form state.'
    );
  });

  test('When the user is on the reset-password page, the log in link is present.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/reset-password?token=some-token');
    await expect(page.getByRole('link', { name: /log in|forgot/i })).toBeVisible();
  });
});
