import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Invite', () => {
  test('invalid invite token shows invalid or expired state', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-invite-route-with-invalid-token-and-expect-invalid-or-expired-message',
      async () => {
        await page.goto('/invite/invalid-token-99999');
      }
    );
    await expect(
      page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
    ).toBeVisible();
  });

  test('authenticated user still sees invalid state for invalid token', async ({
    page,
  }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'login-then-navigate-to-invalid-invite-token-and-expect-invalid-state',
      async () => {
        await page.goto('/invite/invalid-token-99999');
      }
    );
    await expect(
      page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'invite-page-invalid-state-visible-for-authenticated-user-with-invalid-token'
    );
  });
});
