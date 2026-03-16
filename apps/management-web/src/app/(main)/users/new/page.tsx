import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs, ContentPageLayout, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { ResourcePageCard } from '../../../../components/ResourcePageCard';
import { UserForm } from '../../../../components/users/UserForm';
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

export default async function NewUserPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'usersCrud');
  if (!crud.create) {
    redirect(ROUTES.USERS);
  }

  const tCommon = await getTranslations('common');
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: tCommon('users'), href: ROUTES.USERS },
    { label: tCommon('addUserTitle'), href: undefined },
  ];

  return (
    <ContentPageLayout
      breadcrumbs={<Breadcrumbs items={breadcrumbItems} LinkComponent={BreadcrumbLink} />}
      contentMaxWidth="form"
    >
      <ResourcePageCard title={tCommon('addUserTitle')} skipContainer>
        <UserForm mode="create" />
      </ResourcePageCard>
    </ContentPageLayout>
  );
}
