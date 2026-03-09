import { expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

import { actionAndCapture } from './stepScreenshots';

export async function expectUnauthedRouteRedirectsToLogin(
  page: Page,
  testInfo: TestInfo,
  stepLabel: string,
  action: () => Promise<void>
): Promise<void> {
  await actionAndCapture(page, testInfo, stepLabel, async () => {
    await action();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
  });
}
