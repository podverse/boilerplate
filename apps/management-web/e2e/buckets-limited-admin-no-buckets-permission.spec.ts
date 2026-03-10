import { expect, test } from '@playwright/test';

import { loginAsLimitedAdmin } from './helpers/advancedFixtures';
import { capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management buckets-list page for the limited-admin (no buckets permission) user.', () => {
  test('When a limited-admin (no buckets permission) opens the buckets-list route, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets permission)');
    await loginAsLimitedAdmin(page);
    await page.goto('/buckets');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when visiting the buckets route.'
    );
  });
});
