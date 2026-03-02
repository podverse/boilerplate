import { Main } from '@boilerplate/ui';

import { AppHeader } from '../../components/AppHeader';
import { NavTabs } from '../../components/NavTabs';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <NavTabs />
      <Main>{children}</Main>
    </>
  );
}
