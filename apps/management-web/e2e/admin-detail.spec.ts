import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('This suite covers Management admin-detail-page.', () => {
  test('When an unauthenticated user tries to open the admin-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admin-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
      }
    );
  });

  test('When an authenticated user opens the admin-detail-page for the seeded-super-admin, they see the admin detail.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admin-detail-route and sees the seeded-super-admin fields.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/admin/${E2E_SUPER_ADMIN_ID}`));
    await expect(page.getByRole('heading', { name: /view admin/i })).toBeVisible();
    await expect(page.getByText(/username:\s*e2e-superadmin/i)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management admin-detail-page is visible with the seeded-super-admin data.'
    );
  });
});
