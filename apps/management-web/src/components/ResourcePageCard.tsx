import { Card, Container, Stack, Text } from '@boilerplate/ui';

export type ResourcePageCardProps = {
  title: string;
  /** When set, renders an error message above children. */
  error?: string;
  children: React.ReactNode;
};

export function ResourcePageCard({
  title,
  error,
  children,
}: ResourcePageCardProps) {
  return (
    <Container>
      <Stack>
        <Card title={title}>
          {error !== undefined && error !== '' && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {children}
        </Card>
      </Stack>
    </Container>
  );
}
