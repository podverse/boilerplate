import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the home-page for the bucket-owner user.', () => {
  test('When an authenticated user visits the home-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the home-page (/); the app redirects to the dashboard.',
      async () => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'Dashboard page is visible; heading and URL are verified.'
    );
  });
});
