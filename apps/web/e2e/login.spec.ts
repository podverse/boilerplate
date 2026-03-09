import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

test.describe('This suite verifies the login page.', () => {
  test('When an unauthenticated user visits the login page, they see the login form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the login page and sees the form for unauthenticated users.',
      async () => {
        await page.goto('/login');
      }
    );
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The login form is fully visible with email, password, and submit button.'
    );
  });

  test('When the user submits valid credentials, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the login page before entering valid seeded credentials.',
      async () => {
        await page.goto('/login');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User fills email and password with the seeded E2E user and submits.',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The dashboard is visible after successful login with the seeded user.'
    );
  });

  test('When the user submits invalid credentials, an error is shown and they remain on the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the login page before entering invalid credentials.',
      async () => {
        await page.goto('/login');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User fills a wrong password and submits; an error message is shown.',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill('WrongPassword1!');
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByText(/invalid|incorrect|wrong|error/i)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The login page is still visible with an error message after invalid credentials.'
    );
  });

  test('When an authenticated user visits the login page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await actionAndCapture(
      page,
      testInfo,
      'User logs in with the seeded user first to establish a session.',
      async () => {
        await page.goto('/login');
        await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the login page while authenticated and is redirected to the dashboard.',
      async () => {
        await page.goto('/login');
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('When the user clicks the sign-up link, they are taken to the sign-up page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the sign-up link and is navigated to the sign-up page.',
      async () => {
        await page.getByRole('link', { name: /sign up/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/signup/);
  });

  test('When the user clicks the forgot-password link, they are taken to the forgot-password page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the forgot-password link and is navigated to the forgot-password page.',
      async () => {
        await page.getByRole('link', { name: /forgot password/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('When the user logs in with a safe returnUrl, they are redirected to the requested internal route after login.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/login?returnUrl=%2Fsettings');
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User logs in with a safe returnUrl and is redirected to the settings page.',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/settings/);
  });

  test('When the user logs in with an unsafe returnUrl, it is ignored and they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/login?returnUrl=%2F%2Fevil.example');
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User logs in with an unsafe returnUrl and is redirected to the dashboard as fallback.',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
