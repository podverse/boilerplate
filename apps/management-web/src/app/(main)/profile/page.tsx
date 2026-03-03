import { redirect } from 'next/navigation';

import { getServerUser } from '../../../lib/server-auth';
import { ROUTES } from '../../../lib/routes';
import { ProfileContent } from './ProfileContent';

export default async function ProfilePage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  return <ProfileContent initialUser={user} />;
}
