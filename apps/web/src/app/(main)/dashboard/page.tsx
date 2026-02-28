import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, Container, Stack, Text } from '@boilerplate/ui';

import { getServerUser } from '../../../lib/server-auth';
import { ROUTES } from '../../../lib/routes';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const t = await getTranslations('dashboard');
  const displayName = user.displayName ?? user.email;

  return (
    <Container>
      <Stack>
        <Card title={t('title')}>
          <p>{t('hello', { name: displayName })}</p>
          <Text variant="muted">{t('signedInAs', { email: user.email })}</Text>
        </Card>
      </Stack>
    </Container>
  );
}
