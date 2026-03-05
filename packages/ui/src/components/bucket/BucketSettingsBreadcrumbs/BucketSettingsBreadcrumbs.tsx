'use client';

import { Breadcrumbs, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

export type BucketSettingsBreadcrumbsProps = {
  bucketName: string;
  bucketDetailHref: string;
  settingsHref: string;
  settingsLabel: string;
  settingsAriaLabel: string;
  /** Title of the current page (last breadcrumb, text only). */
  currentPageLabel: string;
  /** When true, show bucket → Settings → Admins before current page. */
  isEditAdminPage?: boolean;
  adminsHref?: string;
  adminsLabel?: string;
};

function LinkAdapter({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Breadcrumb for bucket settings. Default: bucket name only.
 * When isEditAdminPage and adminsHref/adminsLabel provided: bucket → Settings → Admins.
 */
export function BucketSettingsBreadcrumbs({
  bucketName,
  bucketDetailHref,
  settingsHref,
  settingsLabel,
  settingsAriaLabel,
  currentPageLabel,
  isEditAdminPage = false,
  adminsHref,
  adminsLabel,
}: BucketSettingsBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: bucketName, href: bucketDetailHref },
    { label: settingsLabel, href: settingsHref },
  ];
  if (isEditAdminPage && adminsHref !== undefined && adminsLabel !== undefined) {
    items.push({ label: adminsLabel, href: adminsHref });
  }
  if (currentPageLabel !== settingsLabel || isEditAdminPage) {
    items.push({ label: currentPageLabel, href: undefined });
  }
  return <Breadcrumbs items={items} LinkComponent={LinkAdapter} ariaLabel={settingsAriaLabel} />;
}
