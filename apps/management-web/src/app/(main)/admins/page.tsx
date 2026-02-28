'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, Card, Container, List, Row, Stack, Text } from '@boilerplate/ui';

import { managementWebAdmins } from '@boilerplate/helpers-requests';
import { useAuth } from '../../../context/AuthContext';
import { getApiBaseUrl } from '../../../lib/api-client';
import { ROUTES } from '../../../lib/routes';
import type { ManagementUser } from '../../../types/management-api';

export default function AdminsPage() {
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<ManagementUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user === null) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  const load = useCallback(async () => {
    if (user === null) return;
    setLoading(true);
    setError(null);
    const baseUrl = getApiBaseUrl();
    const res = await managementWebAdmins.list(baseUrl);
    setLoading(false);
    if (res.ok && res.data !== undefined && Array.isArray(res.data)) {
      setAdmins(res.data as ManagementUser[]);
    } else if (
      res.ok &&
      res.data !== undefined &&
      typeof res.data === 'object' &&
      res.data !== null &&
      'admins' in res.data
    ) {
      setAdmins((res.data as { admins: ManagementUser[] }).admins);
    } else {
      setError(res.error?.message ?? tErrors('failedToLoadAdmins'));
    }
  }, [user, tErrors]);

  useEffect(() => {
    if (user !== null) {
      void load();
    }
  }, [user, load]);

  if (authLoading || user === null) {
    return (
      <Container>
        <p>{tCommon('loading')}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Stack>
        <Row>
          <Link href={ROUTES.DASHBOARD} className="text-sm">
            {tCommon('dashboard')}
          </Link>
        </Row>
        <Card title={tCommon('admins')}>
          {loading && <p>{tCommon('loadingAdmins')}</p>}
          {error !== null && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {!loading && error === null && admins.length === 0 && <p>{tCommon('noAdmins')}</p>}
          {!loading && error === null && admins.length > 0 && (
            <List>
              {admins.map((a) => (
                <li key={a.id}>
                  {a.email}
                  {a.displayName !== undefined && a.displayName !== null && ` (${a.displayName})`}
                </li>
              ))}
            </List>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
