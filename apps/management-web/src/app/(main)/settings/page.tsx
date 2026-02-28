import { redirect } from 'next/navigation';

import { getServerUser } from '../../../lib/server-auth';
import { ROUTES } from '../../../lib/routes';
import { SettingsContent } from './SettingsContent';

export default async function SettingsPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  return <SettingsContent settingsCookieName="management-settings" />;
}
