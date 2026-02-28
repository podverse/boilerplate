import { AppHeader } from '../../components/AppHeader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="layout-main">{children}</main>
    </>
  );
}
