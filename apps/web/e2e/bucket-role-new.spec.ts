import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket role new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`,
      'navigate-to-bucket-role-new-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees role create form', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-role-new-route-and-expect-role-create-form-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'bucket-role-new-form-visible-with-role-name-and-save');
  });

  test('invalid bucket id shows not found', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-bucket-role-new-with-invalid-bucket-id-and-expect-not-found',
      async () => {
        await page.goto('/bucket/invalid-bucket-99999/settings/roles/new');
      }
    );
  });

  test('role name is required before create', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    const submitButton = page.getByRole('button', { name: /save|create/i });
    await expect(roleNameInput).toHaveAttribute('required', '');
    await expect(submitButton).toBeEnabled();
    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-required-role-name-form-and-stay-on-page',
      async () => {
        await submitButton.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`));
  });

  test('valid submit creates custom role and returns to settings roles list', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);

    const roleName = nextFixtureName('e2e-web-role');
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-new-bucket-role-and-expect-roles-list',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(roleName, 'i')).first()).toBeVisible();
  });

  test('when bucket create is on, message create remains checked and disabled', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);

    const bucketCreate = page.getByLabel('Create').nth(1);
    const messageCreate = page.getByLabel('Create').nth(2);

    await expect(bucketCreate).toBeVisible();
    await expect(messageCreate).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'assert-bucket-create-and-message-create-dependency',
      async () => {
        await expect(bucketCreate).toBeChecked();
      }
    );
    await expect(messageCreate).toBeChecked();
    await expect(messageCreate).toBeDisabled();
  });
});
