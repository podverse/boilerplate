'use client';

import { useTranslations } from 'next-intl';
import { Dropdown } from '../Dropdown';
import { Link } from '../Link';
import styles from './AppHeader.module.scss';

export type AppHeaderUser = {
  displayName: string | null;
  email: string;
};

export type AppHeaderLinkComponentProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
};

export type AppHeaderProps = {
  title: React.ReactNode;
  homeHref: string;
  user: AppHeaderUser | null;
  onLogout: () => void;
  navItems: { href: string; label: string }[];
  loginHref?: string;
  LinkComponent?: React.ComponentType<AppHeaderLinkComponentProps>;
};

export function AppHeader({
  title,
  homeHref,
  user,
  onLogout,
  navItems,
  loginHref,
  LinkComponent = Link,
}: AppHeaderProps) {
  const t = useTranslations('ui.header');
  const items = [
    ...navItems.map((item) => ({ type: 'link' as const, href: item.href, label: item.label })),
    { type: 'button' as const, label: t('logout'), onClick: onLogout },
  ];

  return (
    <header className="header-bar">
      <LinkComponent href={homeHref} className={styles.titleLinkWrapper}>
        <span className={styles.titleLink}>
          <h1 className={styles.title}>{title}</h1>
        </span>
      </LinkComponent>
      <div className={styles.actions}>
        {user !== null ? (
          <Dropdown
            aria-label={t('userMenuAria')}
            LinkComponent={LinkComponent}
            items={items}
            trigger={
              <>
                <i className="fa-solid fa-user" aria-hidden />
                <span className={styles.userLabel}>{user.displayName ?? user.email}</span>
              </>
            }
          />
        ) : loginHref !== undefined ? (
          <LinkComponent href={loginHref}>
            <span className={styles.loginLink}>{t('logIn')}</span>
          </LinkComponent>
        ) : null}
      </div>
    </header>
  );
}
