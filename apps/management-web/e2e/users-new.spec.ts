import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Management users new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-users-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/users/new');
      }
    );
  });

  test('authenticated user sees add user form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-new-route-and-expect-add-user-form-visible',
      async () => {
        await page.goto('/users/new');
      }
    );
    await expect(page).toHaveURL(/\/users\/new/);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add user|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-add-user-form-visible-with-credentials-fields'
    );
  });

  test('cancel returns to users list', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');

    await actionAndCapture(
      page,
      testInfo,
      'click-cancel-on-management-user-create-form-and-expect-users-list',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/users(\?|$)/);
  });

  test('empty submit shows validation and stays on page', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');

    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-management-user-create-form-and-expect-validation',
      async () => {
        await page.getByRole('button', { name: /create user|create|save|add user/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/users\/new$/);
    await expect(page.getByText(/required|email|username/i).first()).toBeVisible();
  });

  test('valid user create submits and shows success state', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');

    const email = `${nextFixtureName('e2e-mgmt-user')}@example.com`;
    await page.getByRole('textbox', { name: /email/i }).fill(email);

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-management-user-create-form-and-expect-success-state',
      async () => {
        await page.getByRole('button', { name: /create user|create|save|add user/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/users\/new|\/users(\?|$)/);

    const currentPath = new URL(page.url()).pathname;
    if (currentPath === '/users/new') {
      await expect(page.getByText(/user created|set-password link/i).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /back to users/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /copy link|link copied/i })).toBeVisible();
      return;
    }

    await expect(page).toHaveURL(/\/users(\?|$)/);
    await expect(page.getByText(new RegExp(email, 'i')).first()).toBeVisible();
  });
});
