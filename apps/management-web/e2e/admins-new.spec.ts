import { expect, test } from '@playwright/test';

import {
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/** Password that satisfies strength requirements for create-admin. */
const E2E_VALID_PASSWORD = 'Test!1Aa';

/**
 * Permission: adminsCrud create required; else redirect /admins. Actor matrix: unauthenticated →
 * login; super-admin and admin with admins create → form; admin without admins create →
 * redirect /admins.
 */

test.describe('This suite verifies the management admins-new-page: unauthenticated redirect, permitted role sees add-admin-form, create success and validation.', () => {
  test('When an unauthenticated user tries to open the admins-new-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admins-new-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins/new');
      }
    );
  });

  test('When a permitted user (super-admin) opens the admins-new-page, they see the add-admin-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admins-new-route and sees the add-admin form.',
      async () => {
        await page.goto('/admins/new');
        await expect(page).toHaveURL(/\/admins\/new/);
        await expect(page.getByRole('textbox', { name: /display name/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /^username$/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /add admin|create|save/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management add-admin-form is visible with display name, username and submit button.'
    );
  });

  test('When the user leaves the username empty and submits the add-admin-form, they remain on the page and see a validation message.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins/new');
    await page.getByRole('textbox', { name: /display name/i }).fill('E2E Display');
    await page.getByLabel(/password/i).fill(E2E_VALID_PASSWORD);
    const submitButton = page.getByRole('button', { name: /add admin|create|save/i });
    await expect(submitButton).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the add-admin-form with empty username and remains on the page with validation.',
      async () => {
        await submitButton.click();
        await expect(page).toHaveURL(/\/admins\/new/);
        await expect(page.getByText(/username.*required|required.*username/i)).toBeVisible();
      }
    );
  });

  test('When the user submits a valid new admin, they are returned to the admins list and the new admin is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins/new');

    const username = nextFixtureName('e2e-mgmt-admin');
    await page.getByRole('textbox', { name: /display name/i }).fill(`E2E Admin ${username}`);
    await page.getByRole('textbox', { name: /^username$/i }).fill(username);
    await page.getByLabel(/password/i).fill(E2E_VALID_PASSWORD);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid new admin and is taken to the admins list.',
      async () => {
        await page.getByRole('button', { name: /add admin|create|save/i }).click();
        await expect(page).toHaveURL(/\/admins(\?|$)/);
      }
    );
    await page.goto(`/admins?search=${encodeURIComponent(username)}`);
    await expect(page.getByText(new RegExp(username, 'i')).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admins list shows the newly created admin after submit.'
    );
  });

  test('When an admin without adminsCrud create (e.g. admin-with-bucket-admins) opens the admins-new-page, they are redirected to the admins list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no admins CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/admins/new');
    await expect(page).toHaveURL(/\/admins/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without admins create is redirected to the admins list when opening the admins-new-page.'
    );
  });
});
