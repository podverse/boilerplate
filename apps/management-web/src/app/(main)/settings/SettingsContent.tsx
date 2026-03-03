'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ALL_AVAILABLE_LOCALES, type Locale } from '@boilerplate/helpers';
import {
  ContentPageLayout,
  FormContainer,
  Select,
  ThemeSelector,
  setSettingsCookie,
} from '@boilerplate/ui';

export type SettingsContentProps = {
  settingsCookieName: string;
};

/**
 * Management-web settings content. Structure aligned with web app for consistency;
 * kept as a separate component so web and management-web can diverge in options later.
 */
export function SettingsContent({ settingsCookieName }: SettingsContentProps) {
  const t = useTranslations('settings');
  const locale = useLocale();
  const router = useRouter();
  const localeOptions = ALL_AVAILABLE_LOCALES.map((loc: Locale) => ({
    value: loc,
    label: t(`languages.${loc}`),
  }));

  return (
    <ContentPageLayout title={t('title')}>
      <FormContainer onSubmit={(e) => e.preventDefault()}>
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
      </FormContainer>
    </ContentPageLayout>
  );
}
