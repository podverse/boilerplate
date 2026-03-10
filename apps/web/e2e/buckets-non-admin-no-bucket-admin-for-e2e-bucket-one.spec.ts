import { expect, test } from '@playwright/test';

import { loginAsWebE2ENonAdmin } from './helpers/advancedFixtures';
import { capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the buckets-list-page for the non-admin (no bucket_admin for E2E Bucket One) user.', () => {
  test('When the non-admin opens the buckets-list-page, they see the list or empty state (filtered to buckets they have access to).', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin (no bucket_admin for E2E Bucket One)');
    await page.context().clearCookies();
    await loginAsWebE2ENonAdmin(page);
    await page.goto('/buckets');
    await expect(page).toHaveURL(/\/buckets/);
    await expect(
      page.getByRole('table').or(page.getByText(/no buckets yet|create one to get started/i))
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The non-admin sees the buckets-list-page with list or empty state.'
    );
  });
});
