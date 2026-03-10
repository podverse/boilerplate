import { expect, test } from '@playwright/test';

import { loginAsLimitedAdmin } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management settings-page for the limited-admin user.', () => {
  test('When a limited-admin opens the settings-page, they see settings content and account tabs.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin');
    await loginAsLimitedAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to settings and sees account tab content.',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings|account/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^general$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /password/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'The settings-page is visible for limited-admin.');
  });
});
