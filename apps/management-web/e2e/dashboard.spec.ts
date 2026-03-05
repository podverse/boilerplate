import { test, expect } from '@playwright/test';

/**
 * Proof-of-concept E2E: login with seeded super admin and assert dashboard page loads.
 * Requires e2e seed (e2e-superadmin@example.com / Test!1Aa) and management-api + management-web running.
 */
test.describe('Dashboard', () => {
  test('loads after login and shows dashboard heading', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('e2e-superadmin@example.com');
    await page.getByLabel(/password/i).fill('Test!1Aa');
    await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
