'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ALL_AVAILABLE_LOCALES, type Locale } from '@boilerplate/helpers';
import {
  Card,
  Container,
  PageHeader,
  Stack,
  Select,
  ThemeSelector,
  setSettingsCookie,
} from '@boilerplate/ui';

export type SettingsContentProps = {
  settingsCookieName: string;
};

export function SettingsContent({ settingsCookieName }: SettingsContentProps) {
  const t = useTranslations('settings');
  const locale = useLocale();
  const router = useRouter();
  const localeOptions = ALL_AVAILABLE_LOCALES.map((loc: Locale) => ({
    value: loc,
    label: t(`languages.${loc}`),
  }));

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
              setSettingsCookie(settingsCookieName, { locale: value });
              router.refresh();
            }}
            aria-label={t('languages.language')}
          />
        </Card>
      </Stack>
    </Container>
  );
}
