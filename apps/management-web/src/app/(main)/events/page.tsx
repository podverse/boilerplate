import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, List, Stack, Text } from '@boilerplate/ui';

import { getServerUser } from '../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../config/env';
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

async function fetchEvents(): Promise<{ events: EventItem[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();

  try {
    const res = await request(baseUrl, '/events', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { events: [], error: 'Failed to load events' };
    }

    const data = res.data as { events?: EventItem[] } | undefined;
    if (data?.events !== undefined) {
      return { events: data.events, error: null };
    }
    return { events: [], error: null };
  } catch {
    return { events: [], error: 'Failed to load events' };
  }
}

export default async function EventsPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const tCommon = await getTranslations('common');
  const { events, error } = await fetchEvents();

  return (
    <Container>
      <Stack>
        <Card title={tCommon('events')}>
          {error !== null && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {error === null && events.length === 0 && <p>{tCommon('noEvents')}</p>}
          {error === null && events.length > 0 && (
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
