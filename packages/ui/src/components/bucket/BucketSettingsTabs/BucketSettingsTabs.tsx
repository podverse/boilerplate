'use client';

import { Link, Tabs } from '@boilerplate/ui';
import type { TabItem } from '@boilerplate/ui';

export type BucketSettingsTabsProps = {
  generalHref: string;
  generalLabel: string;
  /** When provided, show General and Admins tabs. When omitted, only General tab. */
  adminsHref?: string;
  adminsLabel?: string;
  activeHref: string;
};

/**
 * Horizontal tabs for bucket settings: General and optionally Admins.
 */
export function BucketSettingsTabs({
  generalHref,
  generalLabel,
  adminsHref,
  adminsLabel,
  activeHref,
}: BucketSettingsTabsProps) {
  const items: TabItem[] = [{ href: generalHref, label: generalLabel }];
  if (adminsHref !== undefined && adminsLabel !== undefined) {
    items.push({ href: adminsHref, label: adminsLabel });
  }
  return <Tabs items={items} LinkComponent={Link} activeHref={activeHref} exactMatch />;
}
