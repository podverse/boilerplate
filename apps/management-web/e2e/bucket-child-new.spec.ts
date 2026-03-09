import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite covers Creating a new-child-bucket in management.', () => {
  test('When an unauthenticated user tries to open the new-child-bucket page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket child new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
  });

  test('When an authenticated user opens the new-child-bucket page, they see the child bucket create form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket child new route and sees the create form.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create topic|create|save|add bucket/i })
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management bucket child new form is visible with name and submit button.'
    );
  });
});
