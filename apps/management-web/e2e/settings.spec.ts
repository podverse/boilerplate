import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management settings-page.', () => {
  test('When an unauthenticated user tries to open the settings-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management settings-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/settings');
      }
    );
  });

  test('When an authenticated user opens the settings-page, they see the settings-page with tabs or form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management settings-page and sees tabs or sections.',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings|account/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management settings-page is visible with tabs or heading.'
    );
  });

  test('When the user opens the settings password tab URL, the password form context loads.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management settings password tab and sees password fields.',
      async () => {
        await page.goto('/settings?tab=password');
      }
    );
    await expect(page).toHaveURL(/\/settings\?tab=password/);
    await expect(page.getByLabel(/current password|new password|password/i).first()).toBeVisible();
  });
});
