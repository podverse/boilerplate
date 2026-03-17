import { getTranslations } from 'next-intl/server';
import { AppTypeTitle, CenterInViewport } from '@boilerplate/ui';

import { getAppTitleIcon } from '../../config/env';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('common');
  const titleIcon = getAppTitleIcon();
  const title = <AppTypeTitle brandName={t('appTitle')} titleIcon={titleIcon} />;
  return <CenterInViewport title={title}>{children}</CenterInViewport>;
}
