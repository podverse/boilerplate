import { expect } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';

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

export async function clickDeleteAndAcceptBrowserDialog(
  page: Page,
  deleteButton: Locator
): Promise<void> {
  page.once('dialog', (dialog) => dialog.accept());
  await deleteButton.click();
}
