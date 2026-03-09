import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';
const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

test.describe('This suite covers Editing a bucket admin in management.', () => {
  test('When an unauthenticated user tries to open the bucket admin-edit-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket admin-edit-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/admins/${E2E_MAIN_USER_ID}/edit`);
      }
    );
  });

  test('When the user opens the bucket admin-edit-page with an invalid admin user id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management bucket admin-edit-page with an invalid user id and sees not found.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/settings/admins/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When the user opens the bucket-admin-edit-route with the seeded-bucket-owner user id, they see the edit page with editing disabled and a message.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/admins/${E2E_MAIN_USER_ID}/edit`);
    await expect(
      page.getByText(/you cannot edit the admin settings for the owner of a bucket/i)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
  });
});
