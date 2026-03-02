'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ALL_AVAILABLE_LOCALES, type Locale } from '@boilerplate/helpers';
import {
  Card,
  Container,
  FormContainer,
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
      <Stack>
        <Card title={t('title')}>
          <FormContainer onSubmit={(e) => e.preventDefault()}>
            <Stack>
              <ThemeSelector label={t('theme')} />
              <Select
                label={t('languages.language')}
                options={localeOptions}
                value={locale}
                onChange={(value) => {
                  setSettingsCookie(settingsCookieName, { locale: value });
                  router.refresh();
                }}
              />
            </Stack>
          </FormContainer>
        </Card>
      </Stack>
    </Container>
  );
}
