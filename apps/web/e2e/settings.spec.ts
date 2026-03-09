import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Settings', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/settings',
      'navigate-to-settings-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees settings page with tabs or form', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-settings-expect-settings-tabs-or-profile-password-sections',
      async () => {
        await page.goto('/settings');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(
      page
        .getByRole('tab', { name: /profile|general|password/i })
        .or(page.getByRole('heading', { name: /settings|profile|account/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'settings-page-visible-with-tabs-or-heading');
  });

  test('password tab validates mismatch and keeps user on settings', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/settings?tab=password');

    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(3);

    await actionAndCapture(
      page,
      testInfo,
      'submit-password-tab-with-mismatch-and-expect-validation-message',
      async () => {
        await passwordInputs.nth(0).fill('Test!1Aa');
        await passwordInputs.nth(1).fill('Test!1Ab');
        await passwordInputs.nth(2).fill('Test!1Ac');
        await page.getByRole('button', { name: /change password|save/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/settings\?tab=password/);
    await expect(page.getByText(/match|failed|error/i).first()).toBeVisible();
  });

  test('email tab shows request form controls', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'open-email-tab-and-verify-new-email-controls',
      async () => {
        await page.goto('/settings?tab=email');
      }
    );

    await expect(page).toHaveURL(/\/settings\?tab=email/);
    await expect(page.getByLabel(/new email/i)).toBeVisible();
  });
});
