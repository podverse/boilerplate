'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Container, Stack, Text, ThemeSelector, useTheme } from '@boilerplate/ui';

import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

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

  return (
    <Container>
      <Stack>
        <Card title={t('theme')}>
          <p>{t('currentTheme', { theme })}</p>
          <ThemeSelector />
        </Card>
        <Card title={t('language')}>
          <Text variant="muted">{t('languagePlaceholder')}</Text>
        </Card>
      </Stack>
    </Container>
  );
}
