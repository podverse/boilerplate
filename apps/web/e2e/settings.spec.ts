import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * Permission: self-only; authenticated user sees own account settings. Actor matrix: unauthenticated
 * → login; any authenticated user → see settings tabs (profile, password, email).
 */
test.describe('This suite verifies the user-settings-page: unauthenticated→redirect, authenticated→settings content and tabs visible, password validation, email-tab controls, and profile save→persist.', () => {
  test('When an unauthenticated user tries to open the user-settings-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/settings',
      'User navigates to the user-settings-page while not logged in and is redirected to the login-page.',
      testInfo
    );
  });

  test('When an authenticated user opens the user-settings-page, they see the settings content with tabs or heading.', async ({
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
      'The user-settings-page is visible with tabs or heading.'
    );
  });

  test('When the user submits the password-tab with a mismatch, validation is shown and they remain on the settings-page.', async ({
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
    await capturePageLoad(
      page,
      testInfo,
      'The settings-page password-tab shows validation and user remains on settings.'
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
        await expect(page).toHaveURL(/\/settings\?tab=email/);
        await expect(page.getByLabel(/new email/i)).toBeVisible();
      }
    );
    await capturePageLoad(page, testInfo, 'The settings-page email-tab shows the new-email form.');
  });

  test('When the user opens the profile-tab and saves a display-name change, the update persists and success feedback is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/settings?tab=profile');
    await expect(page).toHaveURL(/\/settings\?tab=profile/);
    const displayNameInput = page.getByRole('textbox', { name: /display name/i });
    await expect(displayNameInput).toBeVisible();
    const newName = `E2E Settings ${Date.now()}`;
    await displayNameInput.fill(newName);

    await actionAndCapture(
      page,
      testInfo,
      'User clicks update profile on the settings-page and sees success feedback; the new display name persists.',
      async () => {
        await page.getByRole('button', { name: /update profile|save/i }).click();
        await expect(page.getByText(/profile updated|updated successfully/i).first()).toBeVisible();
        await expect(page.getByText(new RegExp(newName, 'i')).first()).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The settings-page profile-tab shows success message and the updated display name.'
    );
  });
});
