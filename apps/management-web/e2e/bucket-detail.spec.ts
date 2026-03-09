import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
/** UUID from tools/web/seed-e2e.mjs E2E_BUCKET1_ID (main DB; management E2E runs after full seed). */
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite covers Management bucket-detail-page.', () => {
  test('When an unauthenticated user tries to open the bucket-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
  });

  test('When an authenticated user opens the bucket-detail-page, they see the bucket detail with tabs or messages.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket-detail-page and sees tabs or messages.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    await expect(page.getByText(/E2E Bucket One/)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management bucket-detail-page is visible with name or tabs.'
    );
  });
});
