import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

async function createPublicMessage(page: import('@playwright/test').Page, body: string) {
  await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
  await page.getByRole('textbox', { name: /your name/i }).fill('E2E Sender');
  await page.getByRole('textbox', { name: /message/i }).fill(body);
  await page.getByRole('button', { name: /send|submit/i }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}$`));
}

test.describe('Bucket message edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/messages/invalid-message-99999/edit`,
      'navigate-to-bucket-message-edit-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('invalid message id shows not found', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-bucket-message-edit-with-invalid-message-id-and-expect-not-found',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages/invalid-message-99999/edit`);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'bucket-message-edit-invalid-message-id-renders-not-found'
    );
  });

  test('existing message can be edited and saved', async ({ page }, testInfo) => {
    const originalBody = `e2e-edit-message-original-${Date.now()}`;
    const updatedBody = `e2e-edit-message-updated-${Date.now()}`.slice(0, 48);
    await createPublicMessage(page, originalBody);
    await loginAsWebE2EUserAndExpectDashboard(page);

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
    const editLink = page.getByRole('link', { name: /edit/i }).first();
    await expect(editLink).toBeVisible();
    await editLink.click();

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages/.+/edit$`));
    const bodyField = page.getByRole('textbox', { name: /message|body/i });
    await expect(bodyField).toBeVisible();
    await bodyField.fill(updatedBody);

    await actionAndCapture(
      page,
      testInfo,
      'save-edited-bucket-message-and-return-to-bucket-detail',
      async () => {
        await page.getByRole('button', { name: /save/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}$`));
  });

  test('cancel from edit page returns to bucket detail', async ({ page }, testInfo) => {
    const originalBody = `e2e-cancel-message-${Date.now()}`;
    await createPublicMessage(page, originalBody);
    await loginAsWebE2EUserAndExpectDashboard(page);

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/messages`);
    const editLink = page.getByRole('link', { name: /edit/i }).first();
    await expect(editLink).toBeVisible();
    await editLink.click();

    await actionAndCapture(
      page,
      testInfo,
      'click-cancel-on-edit-message-form-and-return-to-bucket-detail',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}$`));
  });
});
