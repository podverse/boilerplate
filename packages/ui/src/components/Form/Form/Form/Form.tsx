import { Card } from '../../../layout/Card';
import { Stack } from '../../../layout/Stack';
import { SubmitError } from '../SubmitError';

export type FormProps = {
  title: string;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  submitError?: string | null;
  children: React.ReactNode;
};

export function Form({ title, onSubmit, submitError, children }: FormProps) {
  return (
    <Card title={title}>
      <form onSubmit={onSubmit}>
        <Stack>
          <SubmitError message={submitError} />
          {children}
        </Stack>
      </form>
    </Card>
  );
}
