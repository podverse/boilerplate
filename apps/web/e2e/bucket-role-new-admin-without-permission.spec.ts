import { test } from '@playwright/test';

import { loginAsWebE2EAdminWithoutPermission } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies the bucket-role-new-page for the admin-without-permission user.', () => {
  test.skip('When the non-owner admin without bucket roles permission opens the bucket-role-new-page, they see not found (skipped until route is permission-gated server-side).', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin-without-permission');
    await loginAsWebE2EAdminWithoutPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-new-page and sees not found (no bucket update permission).',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
      }
    );
  });
});
