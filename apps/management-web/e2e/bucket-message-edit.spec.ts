import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite covers Management bucket-message-edit-route.', () => {
  test('When an unauthenticated user tries to open the bucket-message-edit-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-message-edit-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When the user opens the message edit page with an invalid message id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management bucket-message-edit-page with an invalid message id and sees not found.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });
});
