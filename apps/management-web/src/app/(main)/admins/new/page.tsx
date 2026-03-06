import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AdminForm } from '../../../../components/admins/AdminForm';
import { ResourcePageCard } from '../../../../components/ResourcePageCard';
import { getServerUser } from '../../../../lib/server-auth';
import { getCrudFlags } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';

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

  return (
    <ResourcePageCard title={tCommon('addAdminTitle')}>
      <AdminForm mode="create" canEditPermissions={canEditPermissions} />
    </ResourcePageCard>
  );
}
