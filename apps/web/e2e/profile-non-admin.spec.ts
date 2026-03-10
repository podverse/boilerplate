import { expect, test } from '@playwright/test';

import { loginAsWebE2ENonAdmin } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the user-profile-page for the non-admin user.', () => {
  test('When the non-admin opens the user-profile-page, they are redirected to settings and see their profile or identity.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the user-profile-page and is redirected to settings with profile content or display name visible.',
      async () => {
        await page.goto('/profile');
        await expect(page).toHaveURL(/\/settings/);
        await expect(
          page
            .getByRole('tab', { name: /profile|general|password/i })
            .or(page.getByRole('heading', { name: /settings|profile|account/i }))
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The user-profile-page (settings) is visible for the non-admin (self only).'
    );
  });
});
