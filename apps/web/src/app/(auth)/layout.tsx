import { AppTypeTitle, CenterInViewport } from '@boilerplate/ui';
import { getRuntimeConfig } from '../../config/runtime-config-store';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const brandName = runtimeConfig.env.NEXT_PUBLIC_BRAND_NAME ?? 'boilerplate-web';
  const titleIcon = runtimeConfig.env.NEXT_PUBLIC_APP_TITLE_ICON?.trim() || undefined;
  const title = <AppTypeTitle brandName={brandName} titleIcon={titleIcon} />;
  return <CenterInViewport title={title}>{children}</CenterInViewport>;
}
