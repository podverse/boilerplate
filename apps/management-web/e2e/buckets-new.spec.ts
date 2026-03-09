import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Creating a new-management-bucket.', () => {
  test('When an unauthenticated user tries to open the new bucket page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management buckets new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/buckets/new');
      }
    );
  });

  test('When an authenticated user opens the new bucket page, they see the add bucket form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management buckets new route and sees the add bucket form.',
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
      'The management add bucket form is visible with name and submit button.'
    );
  });

  test('When the user submits the new bucket form without required fields, validation is shown and they remain on the page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the empty management bucket create form and sees validation.',
      async () => {
        await page.getByRole('button', { name: /create bucket|add bucket|create|save/i }).click();
        await expect(page).toHaveURL(/\/buckets\/new$/);
        await expect(page.getByText(/required|name|owner/i).first()).toBeVisible();
      }
    );
  });

  test('When the user clicks cancel on the new bucket form, they are returned to the buckets list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks cancel on the management bucket create form and is taken to the buckets list.',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/buckets(\?|$)/);
  });

  test('When the user submits a valid bucket create form, the form submits and they are redirected to the bucket surface.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();

    const bucketName = nextFixtureName('e2e-mgmt-bucket');
    await page.getByRole('textbox', { name: /name|bucket/i }).fill(bucketName);

    const ownerSelect = page.getByLabel(/owner/i);
    if ((await ownerSelect.count()) > 0) {
      await ownerSelect.selectOption({ index: 1 });
    }

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid management bucket create form and is redirected.',
      async () => {
        await page.getByRole('button', { name: /create bucket|add bucket|create|save/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/bucket\/|\/buckets$/);
    await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
  });
});
