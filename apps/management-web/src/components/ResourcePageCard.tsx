import { Container, SectionWithHeading, Text } from '@boilerplate/ui';

export type ResourcePageCardProps = {
  title: string;
  /** When set, renders an error message above children. */
  error?: string;
  children: React.ReactNode;
};

export function ResourcePageCard({ title, error, children }: ResourcePageCardProps) {
  return (
    <Container>
      <SectionWithHeading title={title}>
        {error !== undefined && error !== '' && (
          <Text variant="error" role="alert">
            {error}
          </Text>
        )}
        {children}
      </SectionWithHeading>
    </Container>
  );
}
