'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { bitmaskToFlags, flagsToBitmask } from '@boilerplate/helpers';
import type { CrudBit } from '@boilerplate/helpers';
import { managementWebAdmins } from '@boilerplate/helpers-requests';
import type { CreateAdminBody, EventVisibility, UpdateAdminBody } from '@boilerplate/helpers-requests';
import { Button, CheckboxField, CrudCheckboxes, FormActions, FormSection, Input, Select, Text } from '@boilerplate/ui';

import { getManagementApiBaseUrl } from '../../config/env';
import { ROUTES } from '../../lib/routes';

export type AdminFormInitialValues = {
  displayName: string;
  email: string;
  permissions: {
    adminsCrud: number;
    usersCrud: number;
    canChangePasswords: boolean;
    canAssignPermissions: boolean;
    eventVisibility: EventVisibility;
  } | null;
};

export type AdminFormProps = {
  mode: 'create' | 'edit';
  adminId?: string;
  initialValues?: AdminFormInitialValues;
  isSuperAdmin: boolean;
};

export function AdminForm({ mode, adminId, initialValues, isSuperAdmin }: AdminFormProps) {
  const router = useRouter();
  const t = useTranslations('common.adminForm');
  const apiBaseUrl = getManagementApiBaseUrl();

  const crudLabels: Record<CrudBit, string> = {
    create: t('crudCreate'),
    read: t('crudRead'),
    update: t('crudUpdate'),
    delete: t('crudDelete'),
  };

  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');

  const defaultPerms = initialValues?.permissions;
  const [adminsCrudFlags, setAdminsCrudFlags] = useState<Record<CrudBit, boolean>>(
    bitmaskToFlags(defaultPerms?.adminsCrud ?? 0)
  );
  const [usersCrudFlags, setUsersCrudFlags] = useState<Record<CrudBit, boolean>>(
    bitmaskToFlags(defaultPerms?.usersCrud ?? 0)
  );
  const [canChangePasswords, setCanChangePasswords] = useState(defaultPerms?.canChangePasswords ?? false);
  const [canAssignPermissions, setCanAssignPermissions] = useState(defaultPerms?.canAssignPermissions ?? false);
  const [eventVisibility, setEventVisibility] = useState<EventVisibility>(
    defaultPerms?.eventVisibility ?? 'own'
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const eventVisibilityOptions = [
    { value: 'own' as EventVisibility, label: t('eventVisibilityOwn') },
    { value: 'all_admins' as EventVisibility, label: t('eventVisibilityAllAdmins') },
    { value: 'all' as EventVisibility, label: t('eventVisibilityAll') },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);

    try {
      if (mode === 'create') {
        const body: CreateAdminBody = {
          displayName: displayName.trim(),
          email: email.trim(),
          password,
          adminsCrud: flagsToBitmask(adminsCrudFlags),
          usersCrud: flagsToBitmask(usersCrudFlags),
          canChangePasswords,
          canAssignPermissions,
          eventVisibility,
        };
        const res = await managementWebAdmins.createAdmin(apiBaseUrl, body);
        if (!res.ok) {
          setSubmitError(res.error.message ?? t('createFailed'));
          return;
        }
        router.push(ROUTES.ADMINS);
        router.refresh();
      } else {
        if (adminId === undefined) return;
        const body: UpdateAdminBody = {};
        if (displayName.trim() !== (initialValues?.displayName ?? '')) {
          body.displayName = displayName.trim();
        }
        if (email.trim() !== (initialValues?.email ?? '')) {
          body.email = email.trim();
        }
        if (password !== '') {
          body.password = password;
        }
        if (isSuperAdmin) {
          body.adminsCrud = flagsToBitmask(adminsCrudFlags);
          body.usersCrud = flagsToBitmask(usersCrudFlags);
          body.canChangePasswords = canChangePasswords;
          body.canAssignPermissions = canAssignPermissions;
          body.eventVisibility = eventVisibility;
        }
        const res = await managementWebAdmins.updateAdmin(apiBaseUrl, adminId, body);
        if (!res.ok) {
          setSubmitError(res.error.message ?? t('updateFailed'));
          return;
        }
        router.push(ROUTES.ADMINS);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="stack"
    >
      <Input
        label={t('displayName')}
        value={displayName}
        onChange={setDisplayName}
        required
        autoComplete="off"
      />
      <Input
        label={t('email')}
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoComplete="off"
      />
      <Input
        label={mode === 'create' ? t('password') : t('passwordEditHint')}
        type="password"
        value={password}
        onChange={setPassword}
        required={mode === 'create'}
        autoComplete="new-password"
      />

      {isSuperAdmin && (
        <FormSection title={t('permissions')}>
          <CrudCheckboxes
            label={t('adminsCrud')}
            labels={crudLabels}
            flags={adminsCrudFlags}
            onChange={setAdminsCrudFlags}
          />
          <CrudCheckboxes
            label={t('usersCrud')}
            labels={crudLabels}
            flags={usersCrudFlags}
            onChange={setUsersCrudFlags}
          />
          <CheckboxField
            label={t('canChangePasswords')}
            checked={canChangePasswords}
            onChange={setCanChangePasswords}
          />
          <CheckboxField
            label={t('canAssignPermissions')}
            checked={canAssignPermissions}
            onChange={setCanAssignPermissions}
          />
          <Select
            label={t('eventVisibility')}
            value={eventVisibility}
            onChange={(v) => setEventVisibility(v as EventVisibility)}
            options={eventVisibilityOptions}
          />
        </FormSection>
      )}

      {submitError !== null && (
        <Text variant="error" role="alert">
          {submitError}
        </Text>
      )}

      <FormActions>
        <Button type="submit" variant="primary" loading={loading}>
          {mode === 'create' ? t('createAdmin') : t('saveChanges')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(ROUTES.ADMINS)}
          disabled={loading}
        >
          {t('cancel')}
        </Button>
      </FormActions>
    </form>
  );
}
