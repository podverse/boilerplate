import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ResourcePageCard } from '../../../../components/ResourcePageCard';
import { UserForm } from '../../../../components/users/UserForm';
import { getServerUser } from '../../../../lib/server-auth';
import { getCrudFlags } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';

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

  return (
    <ResourcePageCard title={tCommon('addUserTitle')}>
      <UserForm mode="create" />
    </ResourcePageCard>
  );
}
