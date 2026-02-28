'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ALL_AVAILABLE_LOCALES, type Locale } from '@boilerplate/helpers';
import { Card, Container, PageHeader, Stack, Select, ThemeSelector } from '@boilerplate/ui';

import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function setLocaleCookie(value: string): void {
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();
  const localeOptions = ALL_AVAILABLE_LOCALES.map((loc: Locale) => ({
    value: loc,
    label: t(`languages.${loc}`),
  }));

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
      <PageHeader title={t('title')} />
      <Stack>
        <Card title={t('theme')}>
          <ThemeSelector />
        </Card>
        <Card title={t('languages.language')}>
          <Select
            options={localeOptions}
            value={locale}
            onChange={(value) => {
              setLocaleCookie(value);
              router.refresh();
            }}
            aria-label={t('languages.language')}
          />
        </Card>
      </Stack>
    </Container>
  );
}
