import type { AccountSettingsTab } from '../../../lib/routes';

import { redirect } from 'next/navigation';

import { getWebAuthModeCapabilities } from '../../../lib/authMode';
import { ROUTES } from '../../../lib/routes';
import { getServerUser } from '../../../lib/server-auth';
import { SettingsPageContent } from './SettingsPageContent';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const resolvedSearch = searchParams !== undefined ? await searchParams : {};
  const tabParam = resolvedSearch.tab ?? 'general';

  const authCapabilities = getWebAuthModeCapabilities(process.env.NEXT_PUBLIC_AUTH_MODE);
  if (tabParam === 'email' && !authCapabilities.canUseEmailVerificationFlows) {
    redirect(ROUTES.SETTINGS);
  }

  const activeTab: AccountSettingsTab =
    tabParam === 'profile'
      ? 'profile'
      : tabParam === 'password'
        ? 'password'
        : tabParam === 'email'
          ? 'email'
          : 'general';

  return <SettingsPageContent initialUser={user} activeTab={activeTab} />;
}
