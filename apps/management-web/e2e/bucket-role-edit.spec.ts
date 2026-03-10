import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

/**
 * Permission: settings layout gates by bucketsCrud read → redirect dashboard; role-edit is under
 * settings. Actor matrix: unauthenticated → login; super-admin → full edit; admin with buckets read
 * (e.g. admin-with-bucket-admins) → list→edit, Cancel→list, Save→list, invalid id → not found;
 * limited-admin (no buckets read) → redirect to dashboard.
 */

test.describe('This suite verifies the management bucket-role-edit-page: unauthenticated redirect, invalid role id→not found, permitted role sees form, list→edit, Cancel→roles-list, Save→roles-list and persistence.', () => {
  test('When an unauthenticated user tries to open the bucket-role-edit-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-role-edit-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/settings/roles/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When the super-admin opens the bucket-role-edit-page with an invalid role id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-edit-page with an invalid role id and sees not found.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/settings/roles/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When a permitted user (super-admin) navigates from the bucket-settings roles-tab to the role-edit-page via the edit link, they see the role-edit-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const roleName = nextFixtureName('e2e-mgmt-role');
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));

    await actionAndCapture(
      page,
      testInfo,
      'User clicks the edit link for the custom role and is taken to the role-edit-page.',
      async () => {
        const row = page.locator('li', { hasText: roleName }).first();
        await row.getByRole('link', { name: /edit/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings/roles/[^/]+/edit`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-edit-page shows the role form with name and save button.'
    );
  });

  test('When the user clicks Cancel on the role-edit-form, they are returned to the bucket-settings roles-list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const roleName = nextFixtureName('e2e-mgmt-role-cancel');
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    const row = page.locator('li', { hasText: roleName }).first();
    await row.getByRole('link', { name: /edit/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings/roles/[^/]+/edit`));

    await actionAndCapture(
      page,
      testInfo,
      'User clicks Cancel on the role-edit-form and is returned to the roles-list.',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
      }
    );
    await capturePageLoad(page, testInfo, 'The bucket-settings roles-tab is visible after Cancel.');
  });

  test('When the user edits an existing custom role and saves, the role is updated and they return to the roles-list with the updated name visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const createdName = nextFixtureName('e2e-mgmt-role');
    const updatedName = nextFixtureName('e2e-mgmt-role-updated');

    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name|name/i }).fill(createdName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    await expect(page.getByText(new RegExp(createdName, 'i')).first()).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User opens the role-edit-page for the created custom role.',
      async () => {
        const row = page.locator('li', { hasText: createdName }).first();
        await row.getByRole('link', { name: /edit/i }).click();
      }
    );

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    await expect(roleNameInput).toBeVisible();
    await roleNameInput.fill(updatedName);

    await actionAndCapture(
      page,
      testInfo,
      'User saves the updated role and is returned to the roles-list.',
      async () => {
        await page.getByRole('button', { name: /save/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    await expect(page.getByText(new RegExp(updatedName, 'i')).first()).toBeVisible();
    await capturePageLoad(page, testInfo, 'The roles-list shows the updated role name after save.');
  });

  test('When a limited-admin (no buckets read) opens the bucket-role-edit-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets read)');
    await loginAsLimitedAdmin(page);
    await page.goto(
      `/bucket/${E2E_BUCKET1_ID}/settings/roles/99999999-9999-4999-a999-999999999999/edit`
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when opening the bucket-role-edit-page.'
    );
  });

  test('When an admin with buckets read opens the bucket-role-edit-page via the roles-list, they see the role-edit form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    const roleName = nextFixtureName('e2e-mgmt-role-admin');
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));

    await actionAndCapture(
      page,
      testInfo,
      'User clicks the edit link for the role and is taken to the role-edit-page.',
      async () => {
        const row = page.locator('li', { hasText: roleName }).first();
        await row.getByRole('link', { name: /edit/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings/roles/[^/]+/edit`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-edit form is visible for the admin with buckets read.'
    );
  });
});
