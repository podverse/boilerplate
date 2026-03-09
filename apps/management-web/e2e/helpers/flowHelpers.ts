import { expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

import { actionAndCapture } from './stepScreenshots';

export async function expectInvalidRouteShowsNotFound(
  page: Page,
  testInfo: TestInfo,
  stepLabel: string,
  action: () => Promise<void>
): Promise<void> {
  await actionAndCapture(page, testInfo, stepLabel, action);
  await expect(page.getByText(/not found|404/i).first()).toBeVisible();
}

export async function clickConfirmDeleteInModal(page: Page): Promise<void> {
  const confirmDeleteButton = page
    .locator('button')
    .filter({ hasText: /delete/i })
    .last();
  await expect(confirmDeleteButton).toBeVisible();
  await confirmDeleteButton.click();
}
