import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs, ContentPageLayout, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { AdminForm } from '../../../../components/admins/AdminForm';
import { ResourcePageCard } from '../../../../components/ResourcePageCard';
import { getServerUser } from '../../../../lib/server-auth';
import { getCrudFlags } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';

function BreadcrumbLink({
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

export default async function NewAdminPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'adminsCrud');
  if (!crud.create) {
    redirect(ROUTES.ADMINS);
  }

  const canEditPermissions = crud.create || crud.update;

  const tCommon = await getTranslations('common');
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: tCommon('admins'), href: ROUTES.ADMINS },
    { label: tCommon('addAdminTitle'), href: undefined },
  ];

  return (
    <ContentPageLayout
      breadcrumbs={<Breadcrumbs items={breadcrumbItems} LinkComponent={BreadcrumbLink} />}
      contentMaxWidth="form"
    >
      <ResourcePageCard title={tCommon('addAdminTitle')} skipContainer>
        <AdminForm mode="create" canEditPermissions={canEditPermissions} />
      </ResourcePageCard>
    </ContentPageLayout>
  );
}
