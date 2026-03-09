import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

test.describe('This suite covers Management user-detail-page.', () => {
  test('When an unauthenticated user tries to open the user-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management user-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
      }
    );
  });

  test('When an authenticated user opens the user-detail-page for the seeded-e2e-user, they see the user detail.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management user-detail-route and sees the seeded-e2e-user fields.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}`));
    await expect(page.getByText(/e2e@example.com|view user|email/i).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management user-detail-page is visible with the seeded-e2e-user email.'
    );
  });

  test('When the user opens the user-detail-page with an invalid user id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management user-detail-page with an invalid user id and sees not found.',
      async () => {
        await page.goto('/user/99999999-9999-4999-a999-999999999999');
      }
    );
  });
});
