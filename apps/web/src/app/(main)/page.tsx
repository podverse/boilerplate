'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@boilerplate/ui';

import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../lib/routes';

export default function HomePage() {
  const tCommon = useTranslations('common');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user !== null) {
      router.replace(ROUTES.DASHBOARD);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Container>
        <p>{tCommon('loading')}</p>
      </Container>
    );
  }

  return null;
}
