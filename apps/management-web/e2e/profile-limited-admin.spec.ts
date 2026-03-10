import { expect, test } from '@playwright/test';

import { loginAsLimitedAdmin } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management profile flow for the limited-admin user.', () => {
  test('When a limited-admin opens the profile-page, they are redirected to settings and can view profile fields.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin');
    await loginAsLimitedAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the profile-page and is redirected to settings.',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await page.getByRole('link', { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/settings\?tab=profile/);
    await expect(page.getByRole('textbox', { name: /display name/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The profile tab is visible for limited-admin on settings.'
    );
  });
});
