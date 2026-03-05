'use client';

import { Breadcrumbs, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

export type BucketMessagesBreadcrumbsProps = {
  bucketName: string;
  bucketDetailHref: string;
  messagesAriaLabel: string;
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

export function BucketMessagesBreadcrumbs({
  bucketName,
  bucketDetailHref,
  messagesAriaLabel,
}: BucketMessagesBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [{ label: bucketName, href: bucketDetailHref }];
  return <Breadcrumbs items={items} LinkComponent={LinkAdapter} ariaLabel={messagesAriaLabel} />;
}
