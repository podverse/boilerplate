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

  if (!user.isSuperAdmin) {
    redirect(ROUTES.ADMINS);
  }

  const tCommon = await getTranslations('common');

  return (
    <Container>
      <Stack>
        <Card title={tCommon('addAdminTitle')}>
          <AdminForm mode="create" isSuperAdmin={user.isSuperAdmin} />
        </Card>
      </Stack>
    </Container>
  );
}
