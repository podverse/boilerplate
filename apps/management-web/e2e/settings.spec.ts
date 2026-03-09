import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Settings', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-settings-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/settings');
      }
    );
  });

  test('authenticated user sees settings page with tabs or form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-settings-expect-tabs-or-sections',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings|account/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-settings-page-visible-with-tabs-or-heading');
  });

  test('settings password tab url loads password form context', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-settings-password-tab-and-expect-password-fields-visible',
      async () => {
        await page.goto('/settings?tab=password');
      }
    );
    await expect(page).toHaveURL(/\/settings\?tab=password/);
    await expect(page.getByLabel(/current password|new password|password/i).first()).toBeVisible();
  });
});
