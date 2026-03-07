import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

/**
 * Minimal home smoke: unauthenticated `/` should redirect to `/login`.
 */
test.describe('Home', () => {
  test('redirects unauthenticated users to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-home-route-and-expect-redirect-to-login-page-for-unauthenticated-user',
      async () => {
        await page.goto('/');
      }
    );
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-login-page-is-fully-visible-with-authentication-call-to-action-for-unauthenticated-user'
    );
  });
});
