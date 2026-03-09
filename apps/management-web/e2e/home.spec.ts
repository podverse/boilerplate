import { expect, test } from '@playwright/test';

import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { capturePageLoad } from './helpers/stepScreenshots';

/**
 * Minimal home smoke: unauthenticated `/` should redirect to `/login`.
 */
test.describe('Home', () => {
  test('redirects unauthenticated users to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'Home redirects unauthenticated users to login',
      async () => {
        await page.goto('/');
      }
    );
    await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'Login page visible for unauthenticated user');
  });
});
