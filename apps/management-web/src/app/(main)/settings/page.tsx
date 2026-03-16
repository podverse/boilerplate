import { redirect } from 'next/navigation';

import { getServerUser } from '../../../lib/server-auth';
import { ROUTES } from '../../../lib/routes';
import type { AccountSettingsTab } from '../../../lib/routes';
import { SettingsContent } from './SettingsContent';

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
  const activeTab: AccountSettingsTab =
    tabParam === 'profile' ? 'profile' : tabParam === 'password' ? 'password' : 'general';

  return (
    <SettingsContent
      settingsCookieName="management-settings"
      initialUser={user}
      activeTab={activeTab}
    />
  );
}
