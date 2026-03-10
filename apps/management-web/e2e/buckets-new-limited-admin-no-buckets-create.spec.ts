import { expect, test } from '@playwright/test';

import { loginAsLimitedAdmin } from './helpers/advancedFixtures';
import { capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management buckets-new page for the limited-admin (no buckets create) user.', () => {
  test('When a limited-admin (no buckets create permission) opens the buckets-new route, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets create)');
    await loginAsLimitedAdmin(page);
    await page.goto('/buckets/new');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when visiting the buckets-new route.'
    );
  });
});
