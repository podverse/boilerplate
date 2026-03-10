import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

/**
 * Permission: canReadUsers (usersCrud read) required; else redirect /users. Actor matrix:
 * unauthenticated → login; super-admin and limited-admin (has users read) → see detail; admin
 * without users read (e.g. admin-with-bucket-admins) → redirect /users.
 */

test.describe('This suite verifies the management user-detail-page: unauthenticated redirect, invalid id→not found, permitted role sees detail and edit link, list→detail flow.', () => {
  test('When an unauthenticated user tries to open the user-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management user-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
      }
    );
  });

  test('When the super-admin opens the user-detail-page with an invalid user id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management user-detail-page with an invalid user id and sees not found.',
      async () => {
        await page.goto('/user/99999999-9999-4999-a999-999999999999');
      }
    );
  });

  test('When a permitted user (super-admin) opens the user-detail-page, they see the user detail and the edit link.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management user-detail-route and sees the user detail and edit link.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}`);
        await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}(?:/|$)`));
        await expect(page.getByText(/e2e@example.com|view user|email/i).first()).toBeVisible();
        await expect(page.locator(`a[href*="/user/${E2E_MAIN_USER_ID}/edit"]`)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management user-detail-page is visible with the seeded-e2e-user email and edit link.'
    );
  });

  test('When the super-admin navigates from the users-list-page to the user-detail-page via the user link, the user detail loads.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users?search=e2e@example.com');
    await expect(page).toHaveURL(/\/users/);
    const detailLink = page.locator(`a[href="/user/${E2E_MAIN_USER_ID}"]`).first();
    await expect(detailLink).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the user link on the users-list-page and reaches the user-detail-page.',
      async () => {
        await detailLink.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}(?:/|$)`));
    await expect(page.getByText(/e2e@example.com|view user|email/i).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The user-detail-page is visible after navigating from the users-list-page.'
    );
  });

  test('When a limited-admin (with users read) opens the user-detail-page, they see the user detail.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (users read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/user/${E2E_MAIN_USER_ID}`);
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}(?:/|$)`));
    await expect(page.getByText(/e2e@example.com|view user|email/i).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin sees the user-detail-page when they have users read permission.'
    );
  });

  test('When an admin without usersCrud (e.g. admin-with-bucket-admins) opens the user-detail-page, they are redirected to the users list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no users CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/user/${E2E_MAIN_USER_ID}`);
    await expect(page).toHaveURL(/\/users/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without usersCrud is redirected to the users list when opening the user-detail-page.'
    );
  });
});
