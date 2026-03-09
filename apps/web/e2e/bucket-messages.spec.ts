import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies the bucket-messages-list-page.', () => {
  test('When an unauthenticated user tries to open the bucket-messages-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/messages`,
      'User navigates to the bucket-messages-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the bucket-messages-page, they see the messages list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-messages-page and sees the list or empty state.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(/messages)?`));
    await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-messages-page is visible with a list or empty state.'
    );
  });
});
