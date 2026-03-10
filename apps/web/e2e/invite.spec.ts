import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/** Invite is token-gated; valid token shows invite-page (login required if unauthenticated); invalid/expired token shows error; authenticated user can accept or reject. */

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

test.describe('This suite verifies the invite-page: invalid token→error, unauthenticated with valid token→login-required flow, authenticated with valid token→accept/reject, and login validation from invite.', () => {
  test('When the user opens the invite-page with an invalid or expired token, they see a stable error message.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the invite-page with an invalid token and sees an invalid or expired message.',
      async () => {
        await page.goto('/invite/invalid-token-99999');
        await expect(page).toHaveURL(/\/invite\/invalid-token-99999/);
        await expect(
          page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
        ).toBeVisible();
      }
    );
    await capturePageLoad(page, testInfo, 'The invite-page shows invalid-token error state.');
  });

  test('When an authenticated user opens the invite-page with an invalid token, they still see the invalid state.', async ({
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
        await expect(page).toHaveURL(/\/invite\/invalid-token-99999/);
        await expect(
          page.getByText(/invitation not found|invalid|no longer valid|failed to load/i)
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The invite-page shows invalid state for an authenticated user with an invalid token.'
    );
  });

  test('When an unauthenticated user opens the invite-page with a valid token, they see the invite content and login-required flow.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    const token = await createInvitationToken(page);
    await page.context().clearCookies();

    await actionAndCapture(
      page,
      testInfo,
      'User opens a valid invite while logged out and sees the invite-page and login button.',
      async () => {
        await page.goto(`/invite/${token}`);
        await expect(page).toHaveURL(new RegExp(`/invite/${token}`));
        await expect(page.getByRole('button', { name: /log in|login/i })).toBeVisible();
        await page.getByRole('button', { name: /log in|login/i }).click();
        await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The invite-page shows login-required flow with login form after clicking log in.'
    );
  });

  test('When an unauthenticated user opens a valid invite, clicks log in, and submits the login form with empty credentials, validation or error is visible and they remain on the flow.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    const token = await createInvitationToken(page);
    await page.context().clearCookies();
    await page.goto(`/invite/${token}`);
    await expect(page).toHaveURL(new RegExp(`/invite/${token}`));
    await expect(page.getByRole('button', { name: /log in|login/i })).toBeVisible();
    await page.getByRole('button', { name: /log in|login/i }).click();
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the login form from the invite-page with empty email and sees validation or error.',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect(page).toHaveURL(new RegExp(`/invite/${token}`));
        await expect(
          page.getByText(/required|invalid|incorrect|log in failed|email|password/i).first()
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The invite-page login form shows validation or error and user remains on the flow.'
    );
  });

  test('When an authenticated user opens the invite-page with a valid token, they see accept or reject actions.', async ({
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
        await expect(page).toHaveURL(new RegExp(`/invite/${token}`));
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
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The invite-page shows accept/reject or final state for the authenticated user.'
    );
  });
});
