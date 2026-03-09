import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { clickDeleteAndAcceptBrowserDialog } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket settings', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings`,
      'navigate-to-bucket-settings-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees bucket settings page', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-settings-expect-settings-form-or-admins-section',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings`));
    await expect(page.getByRole('heading', { name: /settings|bucket/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /general/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /admins/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /roles/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-settings-page-visible-with-save-button-or-settings-heading'
    );
  });

  test('bucket settings admins tab url is reachable', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-settings-admins-tab-and-expect-admins-context-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=admins`);
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=admins`)
    );
    await expect(page.getByText(/admins/i).first()).toBeVisible();
  });

  test('admins tab can generate an invitation link', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await page
      .getByRole('textbox', { name: /role name|name/i })
      .fill(`e2e-admin-role-${Date.now()}`);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=admins`);

    await expect(page.getByRole('button', { name: /add admin/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'generate-admin-invitation-link-from-admins-tab',
      async () => {
        await page.getByRole('button', { name: /add admin/i }).click();
      }
    );

    const inviteLinkInput = page
      .getByRole('textbox', { name: /invite link|invitation/i })
      .or(page.locator('input[value*="/invite/"]'));
    await expect(inviteLinkInput.first()).toBeVisible();
  });

  test('admins tab can remove a pending invitation', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await page
      .getByRole('textbox', { name: /role name|name/i })
      .fill(`e2e-admin-role-${Date.now()}`);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=admins`);
    await page.getByRole('button', { name: /add admin/i }).click();
    const pendingRows = page.locator('table tbody tr');
    await expect(pendingRows.first()).toBeVisible();
    const firstInviteHref = await pendingRows
      .first()
      .getByRole('link')
      .first()
      .getAttribute('href');

    await actionAndCapture(
      page,
      testInfo,
      'delete-first-pending-admin-invitation-row',
      async () => {
        await clickDeleteAndAcceptBrowserDialog(
          page,
          pendingRows.first().getByRole('button', { name: /delete/i })
        );
      }
    );
    if (firstInviteHref !== null && firstInviteHref !== '') {
      await expect(page.locator(`a[href="${firstInviteHref}"]`)).toHaveCount(0);
    }
  });

  test('general tab exposes editable controls and cancel returns to bucket detail', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=general`);

    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: /message body max length/i })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /public/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'click-cancel-from-general-settings-and-expect-bucket-detail',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}$`));
  });
});
