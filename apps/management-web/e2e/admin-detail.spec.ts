import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('Management admin detail', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-admin-detail-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
      }
    );
  });

  test('authenticated user sees seeded super admin detail', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admin-detail-route-and-expect-seeded-super-admin-fields-visible',
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
      'management-admin-detail-visible-with-seeded-super-admin-data'
    );
  });
});
