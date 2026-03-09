import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the user-settings-page.', () => {
  test('When an unauthenticated user tries to open the user-settings-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/settings',
      'User navigates to the user-settings-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the user-settings-page, they see the settings page with tabs or form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the user-settings-page and sees tabs or profile and password sections.',
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
    await capturePageLoad(
      page,
      testInfo,
      'The user-settings-page is visible with tabs or heading.'
    );
  });

  test('When the user submits the password-tab with a mismatch, validation is shown and they remain on settings.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/settings?tab=password');

    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(3);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the password-tab with a mismatch and sees a validation message.',
      async () => {
        await passwordInputs.nth(0).fill('Test!1Aa');
        await passwordInputs.nth(1).fill('Test!1Ab');
        await passwordInputs.nth(2).fill('Test!1Ac');
        await page.getByRole('button', { name: /change password|save/i }).click();
        await expect(page).toHaveURL(/\/settings\?tab=password/);
        await expect(page.getByText(/match|failed|error/i).first()).toBeVisible();
      }
    );
  });

  test('When the user opens the email-tab, they see the new-email form controls.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User opens the email-tab and sees the new-email controls.',
      async () => {
        await page.goto('/settings?tab=email');
      }
    );

    await expect(page).toHaveURL(/\/settings\?tab=email/);
    await expect(page.getByLabel(/new email/i)).toBeVisible();
  });
});
