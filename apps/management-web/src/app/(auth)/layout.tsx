import { getTranslations } from 'next-intl/server';
import { CenterInViewport } from '@boilerplate/ui';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('common');
  return <CenterInViewport title={t('appTitleManagement')}>{children}</CenterInViewport>;
}
