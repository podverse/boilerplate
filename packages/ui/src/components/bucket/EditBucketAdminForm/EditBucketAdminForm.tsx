'use client';

import { useState } from 'react';
import { Button } from '../../form/Button/Button';
import { ButtonLink } from '../../form/ButtonLink/ButtonLink';
import { CrudCheckboxes } from '../../form/CrudCheckboxes/CrudCheckboxes';
import type { CrudFlags } from '../../form/CrudCheckboxes/CrudCheckboxes';
import { FormActions } from '../../form/FormActions/FormActions';
import { FormContainer } from '../../form/FormContainer/FormContainer';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import { CRUD_BITS, bitmaskToFlags, flagsToBitmask } from '@boilerplate/helpers';

export type EditBucketAdminFormLabels = {
  bucketPermissions: string;
  messagePermissions: string;
  adminPermissionsLabel: string;
  crudCreate: string;
  crudRead: string;
  crudUpdate: string;
  crudDelete: string;
  save: string;
  cancel: string;
};

export type EditBucketAdminFormPayload = {
  bucketCrud: number;
  messageCrud: number;
  adminCrud: number;
};

export type EditBucketAdminFormProps = {
  initialBucketCrud: number;
  initialMessageCrud: number;
  initialAdminCrud: number;
  labels: EditBucketAdminFormLabels;
  onSubmit: (payload: EditBucketAdminFormPayload) => void | Promise<void>;
  successHref: string;
  cancelHref: string;
  /** If provided, called after successful submit instead of navigating via successHref (e.g. router.push). */
  onSuccess?: () => void;
};

export function EditBucketAdminForm({
  initialBucketCrud,
  initialMessageCrud,
  initialAdminCrud,
  labels,
  onSubmit,
  successHref,
  cancelHref,
  onSuccess,
}: EditBucketAdminFormProps) {
  const crudLabels: Record<'create' | 'read' | 'update' | 'delete', string> = {
    create: labels.crudCreate,
    read: labels.crudRead,
    update: labels.crudUpdate,
    delete: labels.crudDelete,
  };
  const [bucketFlags, setBucketFlags] = useState<CrudFlags>(bitmaskToFlags(initialBucketCrud));
  const [messageFlags, setMessageFlags] = useState<CrudFlags>(bitmaskToFlags(initialMessageCrud));
  const [adminFlags, setAdminFlags] = useState<CrudFlags>({
    ...bitmaskToFlags(initialAdminCrud),
    read: true,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAdminFlagsWithReadForced = (next: CrudFlags) => {
    setAdminFlags({ ...next, read: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    try {
      await Promise.resolve(
        onSubmit({
          bucketCrud: flagsToBitmask(bucketFlags),
          messageCrud: flagsToBitmask(messageFlags),
          adminCrud: flagsToBitmask(adminFlags) | CRUD_BITS.read,
        })
      );
      if (onSuccess !== undefined) {
        onSuccess();
      } else {
        window.location.href = successHref;
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Stack>
        <CrudCheckboxes
          label={labels.bucketPermissions}
          labels={crudLabels}
          flags={bucketFlags}
          onChange={setBucketFlags}
        />
        <CrudCheckboxes
          label={labels.messagePermissions}
          labels={crudLabels}
          flags={messageFlags}
          onChange={setMessageFlags}
        />
        <CrudCheckboxes
          label={labels.adminPermissionsLabel}
          labels={crudLabels}
          flags={adminFlags}
          onChange={setAdminFlagsWithReadForced}
          disabledBits={{ read: true }}
        />
        {submitError !== null && (
          <Text variant="error" size="sm" as="p" role="alert">
            {submitError}
          </Text>
        )}
        <FormActions>
          <Button type="submit" variant="primary" loading={loading}>
            {labels.save}
          </Button>
          <ButtonLink href={cancelHref} variant="secondary">
            {labels.cancel}
          </ButtonLink>
        </FormActions>
      </Stack>
    </FormContainer>
  );
}
