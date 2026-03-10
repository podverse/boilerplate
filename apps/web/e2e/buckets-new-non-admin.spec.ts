import { test } from '@playwright/test';

import { loginAsWebE2ENonAdmin } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the new-bucket-page for the non-admin user.', () => {
  test('When the non-admin opens the new-bucket-page, they see not found (no permission to create root bucket).', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the new-bucket-page and sees not found.',
      async () => {
        await page.goto('/buckets/new');
      }
    );
  });
});
