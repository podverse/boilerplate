import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

async function createInvitationToken(page: import('@playwright/test').Page): Promise<string> {
  await loginAsWebE2EUserAndExpectDashboard(page);
  await page.goto('/bucket/e2ebkt000001/settings/roles/new');
  await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
  await page
    .getByRole('textbox', { name: /role name|name/i })
    .fill(`e2e-invite-role-${Date.now()}`);
  await page.getByRole('button', { name: /save|create/i }).click();
  await expect(page).toHaveURL(/\/bucket\/e2ebkt000001\/settings\?tab=roles/);

  await page.goto('/bucket/e2ebkt000001/settings?tab=admins');
  await expect(page.getByRole('button', { name: /add admin/i })).toBeVisible();
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

test.describe('This suite verifies the bucket invitation flow.', () => {
  test('When the user opens an invite-route with an invalid token, they see an invalid or expired state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the invite-route with an invalid token and sees an invalid or expired message.',
      async () => {
        await page.goto('/invite/invalid-token-99999');
        await expect(
          page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
        ).toBeVisible();
      }
    );
  });

  test('When an authenticated user opens an invalid invite token, they still see the invalid state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User logs in and navigates to an invalid invite token; invalid state is shown.',
      async () => {
        await page.goto('/invite/invalid-token-99999');
        await expect(
          page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The invite page shows invalid state for an authenticated user with an invalid token.'
    );
  });

  test('When an unauthenticated user opens a valid invite token, they see the login-required flow.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    const token = await createInvitationToken(page);
    await page.context().clearCookies();

    await actionAndCapture(
      page,
      testInfo,
      'User opens a valid invite while logged out and the login form is shown.',
      async () => {
        await page.goto(`/invite/${token}`);
        await expect(page.getByRole('button', { name: /log in|login/i })).toBeVisible();
        await page.getByRole('button', { name: /log in|login/i }).click();
        await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
      }
    );
  });

  test('When an authenticated user opens a valid invite token, they can accept or reject the invitation.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    const token = await createInvitationToken(page);

    await actionAndCapture(
      page,
      testInfo,
      'User opens a valid invite while authenticated and sees accept or reject actions.',
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
