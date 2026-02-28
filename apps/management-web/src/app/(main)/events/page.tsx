'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, Card, Container, List, Row, Stack, Text } from '@boilerplate/ui';

import { managementWebEvents } from '@boilerplate/helpers-requests';
import { useAuth } from '../../../context/AuthContext';
import { getApiBaseUrl } from '../../../lib/api-client';
import { ROUTES } from '../../../lib/routes';

type EventItem = {
  id: string;
  actorId: string;
  actorType: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  timestamp: string;
  details: string | null;
};

export default function EventsPage() {
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
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
    const res = await managementWebEvents.list(baseUrl);
    setLoading(false);
    if (
      res.ok &&
      res.data !== undefined &&
      typeof res.data === 'object' &&
      res.data !== null &&
      'events' in res.data
    ) {
      setEvents((res.data as { events: EventItem[] }).events);
    } else {
      setError(res.error?.message ?? tErrors('failedToLoadEvents'));
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
        <Card title={tCommon('events')}>
          {loading && <p>{tCommon('loadingEvents')}</p>}
          {error !== null && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {!loading && error === null && events.length === 0 && <p>{tCommon('noEvents')}</p>}
          {!loading && error === null && events.length > 0 && (
            <List size="sm">
              {events.map((e) => (
                <li key={e.id}>
                  {e.action} — {e.timestamp}
                  {e.details !== null && e.details !== '' && ` (${e.details})`}
                </li>
              ))}
            </List>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
