import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Creating a new-management-user.', () => {
  test('When an unauthenticated user tries to open the new user page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management users new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/users/new');
      }
    );
  });

  test('When an authenticated user opens the new user page, they see the add user form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management users new route and sees the add user form.',
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
      'The management add user form is visible with credentials fields.'
    );
  });

  test('When the user clicks cancel on the new user form, they are returned to the users list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks cancel on the management user create form and is taken to the users list.',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/users(\?|$)/);
  });

  test('When the user submits the new user form without required fields, validation is shown and they remain on the page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the empty management user create form and sees validation.',
      async () => {
        await page.getByRole('button', { name: /create user|create|save|add user/i }).click();
        await expect(page).toHaveURL(/\/users\/new$/);
        await expect(page.getByText(/required|email|username/i).first()).toBeVisible();
      }
    );
  });

  test('When the user submits a valid user create form, the form submits and a success state is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users/new');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

    const email = `${nextFixtureName('e2e-mgmt-user')}@example.com`;
    await page.getByRole('textbox', { name: /email/i }).fill(email);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid management user create form and sees success state.',
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
