import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EAdminWithPermission,
  loginAsWebE2EAdminWithoutPermission,
  loginAsWebE2ENonAdmin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
// seeded-bucket-owner (e2e@example.com)
const E2E_USER_SHORT_ID = 'e2eusr000001';
// non-owner admin with bucket-admins permission (e2e-admin2@example.com)
const E2E_BUCKET1_ADMIN2_SHORT_ID = 'e2eusr000002';
// non-owner admin without bucket update (e2e-admin-readonly@example.com)
const E2E_USER3_SHORT_ID = 'e2eusr000003';
// non-admin (e2e-other@example.com)
const E2E_USER4_SHORT_ID = 'e2eusr000004';

test.describe('This suite verifies editing a bucket admin.', () => {
  test('When an unauthenticated user tries to open the bucket-admin-edit-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`,
      'User navigates to the bucket-admin-edit-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test("When the user opens the bucket-admin-edit-route with the seeded-bucket-owner's user id, they see the edit page with editing disabled and a message.", async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`);
    await expect(
      page.getByText(/you cannot edit the admin settings for the owner of a bucket/i)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-admin-edit page is visible with editing disabled and the owner message.'
    );
  });

  test('When the user opens the bucket-admin-edit-page with an invalid user id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-admin-edit-page with an invalid user id and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/invalid-user-99999/edit`);
      }
    );
  });

  test('When the owner navigates from the admins list to the edit page for the seeded-bucket-admin, the form loads and is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to bucket settings admins tab and sees the admins list.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=admins`);
      }
    );
    await expect(page.getByText(/E2E Admin Two|e2e-admin2@example.com/i).first()).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the edit link for the seeded-bucket-admin and reaches the edit page.',
      async () => {
        await page.locator(`a[href*="admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit"]`).click();
      }
    );
    await expect(page).toHaveURL(
      new RegExp(
        `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
      )
    );
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-admin-edit form is visible after navigating from the admins list.'
    );
  });

  test('When the owner clicks Cancel on the bucket-admin edit page, they return to the admins list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
    );
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks Cancel and returns to the admins list.',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=admins`)
    );
    await expect(page.getByText(/E2E Admin Two|e2e-admin2@example.com/i).first()).toBeVisible();
    await capturePageLoad(page, testInfo, 'The admins list is visible after Cancel.');
  });

  test('When the user opens the bucket-admin-edit-page for the seeded-bucket-admin, the form loads and is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-admin-edit-page for the seeded-bucket-admin and sees the form.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
        );
      }
    );
    await expect(page).toHaveURL(
      new RegExp(
        `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
      )
    );
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-admin-edit-form is visible for the seeded-bucket-admin.'
    );
  });

  test('When the user saves the seeded-bucket-admin edit form, the admin is updated and they return to the admins list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
    );
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks save on the bucket-admin edit form.',
      async () => {
        await page.getByRole('button', { name: /save/i }).click();
      }
    );

    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=admins`)
    );
    await expect(page.getByText(/E2E Admin Two|e2e-admin2@example.com/i).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admins list is visible and shows the updated admin.'
    );
  });

  test('When the non-owner admin with bucket-admins permission opens the edit page for the owner, they see the edit page with editing disabled and a message.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`);
    await expect(
      page.getByText(/you cannot edit the admin settings for the owner of a bucket/i)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-admin-edit page is visible with editing disabled for the owner row.'
    );
  });

  test('When the non-owner admin with bucket-admins permission opens the edit page for themselves, they see the form with Save.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
    );
    await expect(page).toHaveURL(
      new RegExp(
        `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_BUCKET1_ADMIN2_SHORT_ID}/edit`
      )
    );
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'The bucket-admin-edit form is visible for self.');
  });

  test('When the non-owner admin with bucket-admins permission opens the bucket-admin-edit-page with an invalid user id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-admin-edit-page with an invalid user id and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/invalid-user-99999/edit`);
      }
    );
  });

  test('When the non-owner admin without bucket-admins permission opens the bucket-admin-edit-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin-without-permission');
    await loginAsWebE2EAdminWithoutPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-admin-edit-page and sees not found (no bucket update permission).',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`
        );
      }
    );
  });

  test('When the non-admin opens the bucket-admin-edit-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-admin-edit-page and sees not found (no bucket admin row).',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/admins/${E2E_USER_SHORT_ID}/edit`
        );
      }
    );
  });
});
