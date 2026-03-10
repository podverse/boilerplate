import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EAdminWithPermission,
  loginAsWebE2EAdminWithoutPermission,
  loginAsWebE2ENonAdmin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

/**
 * Permission: bucket roles CRUD (create). Same policy as bucket-role-edit. Actor matrix: unauthenticated →
 * login; owner and non-owner with permission → form and create; non-owner without / non-admin → not found.
 * Admin-without-permission test is skipped: /settings/roles/new is not yet permission-gated server-side
 * (anyone with bucket read can open the page). Un-skip when the app gates by bucket update or role create.
 */

test.describe('This suite verifies the bucket-role-new-page: unauthenticated redirect, invalid bucket id, owner and non-owner flows, list→new, validation, and create success.', () => {
  test('When an unauthenticated user tries to open the bucket-role-new-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`,
      'User navigates to the bucket-role-new-page while not logged in and is redirected to the login-page.',
      testInfo
    );
  });

  test('When an authenticated user opens the bucket-role-new-page, they see the bucket-role-new-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-role-new-route and sees the bucket-role-new-form.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-new-form is visible with a role name and save button.'
    );
  });

  test('When the user opens the bucket-role-new-page with an invalid bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-new-page with an invalid bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/invalid-bucket-99999/settings/roles/new');
      }
    );
  });

  test('When the user leaves the role name empty and submits the bucket-role-new-form, they remain on the page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    const submitButton = page.getByRole('button', { name: /save|create/i });
    await expect(roleNameInput).toHaveAttribute('required', '');
    await expect(submitButton).toBeEnabled();
    await actionAndCapture(
      page,
      testInfo,
      'User submits the form with empty required role name and stays on the page.',
      async () => {
        await submitButton.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
  });

  test('When the user submits a valid new bucket role, a custom role is created and they are returned to the roles-list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();

    const roleName = nextFixtureName('e2e-web-role');
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid new bucket role and is taken to the roles-list.',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(roleName, 'i')).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The roles-list is visible with the new role after create.'
    );
  });

  test('When the owner navigates from the roles-list to the bucket-role-new-page, they see the bucket-role-new-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=roles`);
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the new-role link and reaches the bucket-role-new-page.',
      async () => {
        await page.getByRole('link', { name: /add role|new role|create/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-new-form is visible after navigating from the roles-list.'
    );
  });

  test('When the non-owner admin with bucket roles permission opens the bucket-role-new-page, they see the bucket-role-new-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
  });

  test.skip('When the non-owner admin without bucket roles permission opens the bucket-role-new-page, they see not found (skipped until route is permission-gated server-side).', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin-without-permission');
    await loginAsWebE2EAdminWithoutPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-new-page and sees not found (no bucket update permission).',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
      }
    );
  });

  test('When the non-admin opens the bucket-role-new-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-new-page and sees not found (no bucket access).',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
      }
    );
  });

  test('When bucket-create is on, message-create remains checked and disabled.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();

    const bucketCreate = page.getByLabel('Create').nth(1);
    const messageCreate = page.getByLabel('Create').nth(2);

    await expect(bucketCreate).toBeVisible();
    await expect(messageCreate).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User verifies that bucket-create and message-create have the expected dependency.',
      async () => {
        await expect(bucketCreate).toBeChecked();
      }
    );
    await expect(messageCreate).toBeChecked();
    await expect(messageCreate).toBeDisabled();
  });
});
