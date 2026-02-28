'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Container, Row, Stack, Text } from '@boilerplate/ui';
import { Link } from '@boilerplate/ui';

import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Container>
        <p>{tCommon('loading')}</p>
      </Container>
    );
  }

  if (user === null) {
    return null;
  }

  const displayName = user.displayName ?? user.email;

  return (
    <Container>
      <Stack>
        <Card title={t('title')}>
          <p>{t('hello', { name: displayName })}</p>
          <Text variant="muted">{t('signedInAs', { email: user.email })}</Text>
          <nav>
            <Row wrap>
              <Link href={ROUTES.ADMINS} className="text-sm">
                {tCommon('admins')}
              </Link>
              <Link href={ROUTES.EVENTS} className="text-sm">
                {tCommon('events')}
              </Link>
            </Row>
          </nav>
        </Card>
      </Stack>
    </Container>
  );
}
