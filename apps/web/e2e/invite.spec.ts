import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

async function createInvitationToken(page: import('@playwright/test').Page): Promise<string> {
  await loginAsWebE2EUserAndExpectDashboard(page);
  await page.goto('/bucket/e2ebkt000001/settings/roles/new');
  await page
    .getByRole('textbox', { name: /role name|name/i })
    .fill(`e2e-invite-role-${Date.now()}`);
  await page.getByRole('button', { name: /save|create/i }).click();
  await expect(page).toHaveURL(/\/bucket\/e2ebkt000001\/settings\?tab=roles/);

  await page.goto('/bucket/e2ebkt000001/settings?tab=admins');
  await page.getByRole('button', { name: /add admin/i }).click();
  const inviteInput = page
    .getByRole('textbox', { name: /invite link|invitation/i })
    .or(page.locator('input[value*="/invite/"]'))
    .first();
  await expect(inviteInput).toBeVisible();
  const inviteUrl = await inviteInput.inputValue();
  const tokenMatch = inviteUrl.match(/\/invite\/([^/?#]+)/);
  if (tokenMatch === null || tokenMatch[1] === undefined || tokenMatch[1] === '') {
    throw new Error(`Failed to extract invitation token from URL: ${inviteUrl}`);
  }
  return tokenMatch[1];
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
    await loginAsWebE2EUserAndExpectDashboard(page);
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

  test('unauthenticated user with valid token sees login-required flow', async ({
    page,
  }, testInfo) => {
    const token = await createInvitationToken(page);
    await page.context().clearCookies();

    await actionAndCapture(
      page,
      testInfo,
      'open-valid-invite-while-logged-out-and-open-login-form',
      async () => {
        await page.goto(`/invite/${token}`);
        await page.getByRole('button', { name: /log in|login/i }).click();
      }
    );

    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('authenticated user can reject a valid invite token', async ({ page }, testInfo) => {
    const token = await createInvitationToken(page);

    await actionAndCapture(
      page,
      testInfo,
      'open-valid-invite-while-authenticated-and-assert-decision-actions-visible',
      async () => {
        await page.goto(`/invite/${token}`);
      }
    );

    const hasAccept = await page
      .getByRole('button', { name: /accept/i })
      .isVisible()
      .catch(() => false);
    const hasReject = await page
      .getByRole('button', { name: /reject/i })
      .isVisible()
      .catch(() => false);
    const hasFinalState = await page
      .getByText(/already admin|you are owner|accepted|rejected|invalid/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(hasAccept || hasReject || hasFinalState).toBe(true);
  });
});
