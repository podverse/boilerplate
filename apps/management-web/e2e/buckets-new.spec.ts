import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Management buckets new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-buckets-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets/new');
      }
    );
  });

  test('authenticated user sees add bucket form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-new-route-and-expect-add-bucket-form-visible',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-add-bucket-form-visible-with-name-and-submit'
    );
  });

  test('empty submit shows validation and stays on page', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');

    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-management-bucket-create-form-and-expect-validation',
      async () => {
        await page.getByRole('button', { name: /create bucket|add bucket|create|save/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/buckets\/new$/);
    await expect(page.getByText(/required|name|owner/i).first()).toBeVisible();
  });

  test('cancel returns to buckets list', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');

    await actionAndCapture(
      page,
      testInfo,
      'click-cancel-on-management-bucket-create-form-and-expect-buckets-list',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/buckets(\?|$)/);
  });

  test('valid bucket create submits and redirects to bucket surface', async ({
    page,
  }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');

    const bucketName = nextFixtureName('e2e-mgmt-bucket');
    await page.getByRole('textbox', { name: /name|bucket/i }).fill(bucketName);

    const ownerSelect = page.getByLabel(/owner/i);
    if ((await ownerSelect.count()) > 0) {
      await ownerSelect.selectOption({ index: 1 });
    }

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-management-bucket-create-form-and-expect-redirect',
      async () => {
        await page.getByRole('button', { name: /create bucket|add bucket|create|save/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/bucket\/|\/buckets$/);
    await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
  });
});
