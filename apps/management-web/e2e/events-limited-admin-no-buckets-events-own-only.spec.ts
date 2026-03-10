import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management events-page for the limited-admin (no buckets, events own only) user.', () => {
  test('When a limited-admin (no buckets permission, event_visibility own) opens the events-page, they see the events heading and list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets, events own only)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.context().clearCookies();
    await loginAsLimitedAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management events-page as limited-admin and sees the list or empty state.',
      async () => {
        await page.goto('/events');
      }
    );
    await expect(page).toHaveURL(/\/events/);
    await expect(page.getByRole('heading', { name: /events/i })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(/E2E Limited Admin/i)).toBeVisible();
    await expect(page.getByText(/E2E Admin Bucket Admins/i)).toHaveCount(0);
    await expect(page.getByText(/E2E Super Admin/i)).toHaveCount(0);
    await capturePageLoad(
      page,
      testInfo,
      'The events-page is visible for limited-admin with list or empty state.'
    );
  });
});
