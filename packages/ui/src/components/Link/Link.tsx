'use client';

import NextLink from 'next/link';

import styles from './Link.module.scss';

export type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
};

/**
 * Link component that wraps Next.js Link for client-side navigation.
 * Use as the default LinkComponent for FormLinks, AppHeader, and other UI components.
 * Applies shared link styles (primary color, hover underline).
 */
export function Link({ href, children, className = '', onClick, role, ...rest }: LinkProps) {
  const combinedClass = [styles.root, className].filter(Boolean).join(' ');
  return (
    <NextLink href={href} className={combinedClass} onClick={onClick} role={role} {...rest}>
      {children}
    </NextLink>
  );
}
