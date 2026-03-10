import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EAdminWithPermission,
  loginAsWebE2ENonAdmin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies the bucket-messages-page: unauthenticated redirect, owner and non-owner admin see list or empty state, non-admin not found.', () => {
  test('When an unauthenticated user tries to open the bucket-messages-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/messages`,
      'User navigates to the bucket-messages-page while not logged in and is redirected to the login-page.',
      testInfo
    );
  });

  test('When an authenticated user opens the bucket-messages-page, they see the messages-list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-messages-page and sees the messages-list or empty state.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(/messages)?`));
        await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-messages-page is visible with a messages-list or empty state.'
    );
  });

  test('When the non-owner admin with bucket access opens the bucket-messages-page, they see the messages-list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`));
    await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-messages-page is visible with messages-list or empty state for the non-owner admin.'
    );
  });

  test('When the non-admin opens the bucket-messages-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-messages-page and sees not found (no bucket access).',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
      }
    );
  });
});
