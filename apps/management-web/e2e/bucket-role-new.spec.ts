import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite covers Creating a new-bucket-role in management.', () => {
  test('When an unauthenticated user tries to open the new-bucket-role page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-role-new-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
      }
    );
  });

  test('When an authenticated user opens the new-bucket-role page, they see the role create form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket-role-new-route and sees the role form.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`));
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management bucket role new form is visible with role name and save button.'
    );
  });

  test('When the user leaves the role name empty and submits, they remain on the page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    const submitButton = page.getByRole('button', { name: /save|create/i });
    await expect(roleNameInput).toHaveAttribute('required', '');
    await expect(submitButton).toBeEnabled();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the empty management role form and stays on the page.',
      async () => {
        await submitButton.click();
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`));
      }
    );
  });

  test('When the user submits a valid new role, a custom role is created and they are returned to the settings roles list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();

    const roleName = nextFixtureName('e2e-mgmt-role');
    await page.getByRole('textbox', { name: /role name|name/i }).fill(roleName);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid management new role and is taken to the roles list.',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    await expect(page.getByText(new RegExp(roleName, 'i')).first()).toBeVisible();
  });
});
