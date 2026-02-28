import { redirect } from 'next/navigation';

import { getServerUser } from '../../lib/server-auth';
import { ROUTES } from '../../lib/routes';

export default async function HomePage() {
  const user = await getServerUser();

  if (user !== null) {
    redirect(ROUTES.DASHBOARD);
  } else {
    redirect(ROUTES.LOGIN);
  }
}
