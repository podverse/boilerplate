import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Reset password', () => {
  test('invalid token shows error message', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-reset-password-with-invalid-token-expect-error',
      async () => {
        await page.goto('/reset-password?token=invalid-token-12345');
      }
    );
    await expect(
      page.getByRole('alert').or(page.getByText(/invalid|expired|not found|no longer valid/i))
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'reset-password-page-shows-invalid-or-expired-link-message'
    );
  });

  test('no token shows form or token-required state', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-reset-password-without-token-expect-form-or-error',
      async () => {
        await page.goto('/reset-password');
      }
    );
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
    await capturePageLoad(page, testInfo, 'reset-password-page-shows-token-required-or-form-state');
  });

  test('log in link is present', async ({ page }, testInfo) => {
    await page.goto('/reset-password?token=some-token');
    await expect(page.getByRole('link', { name: /log in|forgot/i })).toBeVisible();
  });
});
