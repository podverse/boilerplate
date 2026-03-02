import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, Container, Stack } from '@boilerplate/ui';

import { AdminForm } from '../../../../components/admins/AdminForm';
import { getServerUser } from '../../../../lib/server-auth';
import { ROUTES } from '../../../../lib/routes';

export default async function NewAdminPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const adminsCrud = user.permissions?.adminsCrud ?? 0;
  const canCreateAdmin = user.isSuperAdmin === true || (adminsCrud & 1) !== 0;
  if (!canCreateAdmin) {
    redirect(ROUTES.ADMINS);
  }

  const canEditPermissions =
    user.isSuperAdmin === true || (adminsCrud & 5) !== 0; // create=1 | update=4

  const tCommon = await getTranslations('common');

  return (
    <Container>
      <Stack>
        <Card title={tCommon('addAdminTitle')}>
          <AdminForm
            mode="create"
            isSuperAdmin={user.isSuperAdmin}
            canEditPermissions={canEditPermissions}
          />
        </Card>
      </Stack>
    </Container>
  );
}
