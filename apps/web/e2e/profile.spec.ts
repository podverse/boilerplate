import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/** Profile is self-only: /profile redirects to /settings; authenticated user sees own profile/settings; no user id in URL. */

test.describe('This suite verifies the user-profile-page: unauthenticated→redirect, authenticated→own profile visible, and save profile changes→persist.', () => {
  test('When an unauthenticated user tries to open the user-profile-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/profile',
      'User navigates to the user-profile-page while not logged in and is redirected to the login-page.',
      testInfo
    );
  });

  test('When an authenticated user opens the user-profile-page, they are redirected to settings and see their profile or identity.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the user-profile-page and is redirected to settings with profile content or display name visible.',
      async () => {
        await page.goto('/profile');
        await expect(page).toHaveURL(/\/settings/);
        await expect(page.getByText(/e2e user/i)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The user-profile-page (settings) is visible with user identity or heading.'
    );
  });

  test('When the authenticated user opens the profile tab, updates display name, and saves, the change persists and success feedback is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/settings?tab=profile');
    await expect(page).toHaveURL(/\/settings\?tab=profile/);
    const displayNameInput = page.getByRole('textbox', { name: /display name/i });
    await expect(displayNameInput).toBeVisible();
    const newName = `E2E Profile ${Date.now()}`;
    await displayNameInput.fill(newName);

    await actionAndCapture(
      page,
      testInfo,
      'User clicks update profile and sees success feedback; the new display name persists.',
      async () => {
        await page.getByRole('button', { name: /update profile|save/i }).click();
        await expect(page.getByText(/profile updated|updated successfully/i).first()).toBeVisible();
        await expect(page.getByText(new RegExp(newName, 'i')).first()).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The profile tab shows success message and the updated display name.'
    );
  });
});
