import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
const E2E_USER_SHORT_ID = 'e2eusr000001';

test.describe('Bucket admin edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`,
      'navigate-to-bucket-admin-edit-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('seeded owner user id on admin edit route resolves to not found', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-bucket-admin-edit-route-for-seeded-owner-user-id-and-expect-not-found',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`
        );
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'bucket-admin-edit-route-with-seeded-owner-user-id-shows-not-found'
    );
  });

  test('invalid user id shows not found', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-bucket-admin-edit-with-invalid-user-id-and-expect-not-found',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/invalid-user-99999/edit`);
      }
    );
  });
});
