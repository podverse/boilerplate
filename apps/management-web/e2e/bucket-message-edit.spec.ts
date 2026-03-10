import { expect, test } from '@playwright/test';

import {
  createBucketMessageFixture,
  getCookieHeaderFromPage,
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

/**
 * Permission: canReadBuckets (bucketsCrud read) → else redirect dashboard; bucketMessagesCrud
 * update → else redirect buckets. Actor matrix: unauthenticated → login; super-admin → full edit;
 * limited-admin (no buckets read) → redirect dashboard; admin with buckets read but no message
 * update → redirect to /buckets. Cancel and Save both navigate to bucket view (detail).
 */

test.describe('This suite verifies the management bucket-message-edit-page: unauthenticated redirect, invalid message id→not found, permitted role sees form, list→edit, Cancel→bucket-view, Save→bucket-view and persistence.', () => {
  test('When an unauthenticated user tries to open the bucket-message-edit-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-message-edit-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When the super-admin opens the bucket-message-edit-page with an invalid message id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-message-edit-page with an invalid message id and sees not found.',
      async () => {
        await page.goto(
          `/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`
        );
      }
    );
  });

  test('When a permitted user (super-admin) opens the bucket-message-edit-page, they see the message-edit form.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'E2E message for edit', senderName: 'E2E Sender' },
      { cookieHeader }
    );

    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-message-edit-page and sees the message-edit form.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`);
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`)
    );
    await expect(page.getByRole('textbox', { name: /body|message/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|save changes/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-message-edit form is visible with body and save button.'
    );
  });

  test('When the super-admin navigates from the bucket-view messages-tab to the message-edit-page via the edit link, they see the message-edit form.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'E2E message for list-edit flow', senderName: 'E2E Sender' },
      { cookieHeader }
    );

    await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=messages`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    const editLink = page.locator(`a[href*="/messages/${messageId}/edit"]`).first();
    await expect(editLink).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks the edit link for the message and is taken to the message-edit-page.',
      async () => {
        await editLink.click();
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`)
    );
    await expect(page.getByRole('textbox', { name: /body|message/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-message-edit form is visible after list→edit.'
    );
  });

  test('When the user clicks Cancel on the message-edit form, they are returned to the bucket-view page.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'E2E message for Cancel flow', senderName: 'E2E Sender' },
      { cookieHeader }
    );

    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`);
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks Cancel and is returned to the bucket-view page.',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
      }
    );
    await capturePageLoad(page, testInfo, 'The bucket-view page is visible after Cancel.');
  });

  test('When the user edits the message body and saves, they are taken to the bucket-view page and the updated body is visible on the messages tab.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'Original E2E message body', senderName: 'E2E Sender' },
      { cookieHeader }
    );

    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`);
    const bodyInput = page.getByRole('textbox', { name: /body|message/i });
    await expect(bodyInput).toBeVisible();
    const updatedBody = `Updated E2E message body ${Date.now()}`;
    await bodyInput.fill(updatedBody);

    await actionAndCapture(
      page,
      testInfo,
      'User saves the updated message and is taken to the bucket-view page.',
      async () => {
        await page.getByRole('button', { name: /save changes|save/i }).click();
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
      }
    );

    await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=messages`);
    await expect(page.getByText(updatedBody).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-view messages-tab shows the updated message body after save.'
    );
  });

  test('When a limited-admin (no buckets read) opens the bucket-message-edit-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`);
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when opening the bucket-message-edit-page.'
    );
  });

  test('When an admin with buckets read but without bucketMessagesCrud update opens the bucket-message-edit-page, they are redirected to the buckets list.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no message update');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'E2E message for redirect test', senderName: 'E2E Sender' },
      { cookieHeader }
    );
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`);
    await expect(page).toHaveURL(/\/buckets/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without message-update permission is redirected to the buckets list when opening the bucket-message-edit-page.'
    );
  });
});
