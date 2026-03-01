import { getTranslations } from 'next-intl/server';
import { AppTypeTitle, CenterInViewport } from '@boilerplate/ui';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('common');
  const titleIcon =
    typeof process.env.NEXT_PUBLIC_APP_TITLE_ICON === 'string'
      ? process.env.NEXT_PUBLIC_APP_TITLE_ICON.trim() || undefined
      : undefined;
  const title = <AppTypeTitle appName={t('appTitle')} titleIcon={titleIcon} />;
  return <CenterInViewport title={title}>{children}</CenterInViewport>;
}
