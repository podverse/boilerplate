import type { ReactNode } from 'react';

import { Container } from '../Container';
import { PageHeader } from '../PageHeader';
import { Stack } from '../Stack';
import { Text } from '../Text';

import styles from './ContentPageLayout.module.scss';

export type ContentPageLayoutProps = {
  /** Page title (e.g. "Profile", "Settings"). Rendered as an h1 via PageHeader. */
  title: ReactNode;
  /** Optional error message shown above children when present. */
  error?: string | null;
  /** Variant for the error message. Default "muted". */
  errorVariant?: 'muted' | 'error';
  /** When "form", constrains content to form width (same max-width as FormContainer). Omit for default layout. */
  type?: 'form';
  /** Main content below the header. */
  children: ReactNode;
};

/**
 * Standard layout for content pages with a page header and no table: Container > Stack > PageHeader + optional error + children.
 * Use for profile, settings, and any other page that shows a PageHeader and content (forms, cards) without a filter table.
 * Pass type="form" for pages with multiple form sections so content uses the form max-width.
 */
export function ContentPageLayout({
  title,
  error,
  errorVariant = 'muted',
  type,
  children,
}: ContentPageLayoutProps) {
  const content = type === 'form' ? <div className={styles.form}>{children}</div> : children;
  return (
    <Container>
      <Stack>
        <PageHeader title={title} />
        {error !== undefined && error !== null && error !== '' && (
          <Text variant={errorVariant} role="alert">
            {error}
          </Text>
        )}
        {content}
      </Stack>
    </Container>
  );
}
