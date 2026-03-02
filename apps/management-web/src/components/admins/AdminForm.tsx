'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { bitmaskToFlags, flagsToBitmask, validatePassword } from '@boilerplate/helpers';
import type { CrudBit } from '@boilerplate/helpers';
import { managementWebAdmins } from '@boilerplate/helpers-requests';
import type {
  CreateAdminBody,
  EventVisibility,
  UpdateAdminBody,
} from '@boilerplate/helpers-requests';
import {
  Button,
  CrudCheckboxes,
  FormActions,
  FormContainer,
  FormSection,
  Input,
  PasswordStrengthMeter,
  Select,
  Stack,
  Text,
} from '@boilerplate/ui';
import type { CrudFlags } from '@boilerplate/ui';

import { getManagementApiBaseUrl } from '../../config/env';
import { ROUTES } from '../../lib/routes';

export type AdminFormInitialValues = {
  displayName: string;
  email: string;
  permissions: {
    adminsCrud: number;
    usersCrud: number;
    eventVisibility: EventVisibility;
  } | null;
};

export type AdminFormProps = {
  mode: 'create' | 'edit';
  adminId?: string;
  initialValues?: AdminFormInitialValues;
  isSuperAdmin: boolean;
};

/** Read is required whenever any write bit is on. */
function computeDisabledBits(flags: CrudFlags): Partial<Record<CrudBit, boolean>> {
  const readForced = flags.create || flags.update || flags.delete;
  return readForced ? { read: true } : {};
}

/** Enforce: if any write bit is on, read must be on. */
function withReadEnforced(flags: CrudFlags): CrudFlags {
  if (flags.create || flags.update || flags.delete) {
    return { ...flags, read: true };
  }
  return flags;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Total number of bits set across two CRUD bitmasks. */
function totalBits(a: CrudFlags, b: CrudFlags): number {
  return (Object.values(a) as boolean[]).filter(Boolean).length +
    (Object.values(b) as boolean[]).filter(Boolean).length;
}

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

  // Touched state: show field errors only after the user has interacted with the field
  const [displayNameTouched, setDisplayNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [permissionsTouched, setPermissionsTouched] = useState(false);

  const defaultPerms = initialValues?.permissions;
  // New admins default to all permissions on; edit mode uses actual permissions.
  const defaultAdminsCrud = mode === 'create' ? 15 : (defaultPerms?.adminsCrud ?? 0);
  const defaultUsersCrud = mode === 'create' ? 15 : (defaultPerms?.usersCrud ?? 0);
  const [adminsCrudFlags, setAdminsCrudFlags] = useState<CrudFlags>(
    bitmaskToFlags(defaultAdminsCrud)
  );
  const [usersCrudFlags, setUsersCrudFlags] = useState<CrudFlags>(
    bitmaskToFlags(defaultUsersCrud)
  );
  const [eventVisibility, setEventVisibility] = useState<EventVisibility>(
    defaultPerms?.eventVisibility ?? 'all_admins'
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const eventVisibilityOptions = [
    { value: 'own' as EventVisibility, label: t('eventVisibilityOwn') },
    { value: 'all_admins' as EventVisibility, label: t('eventVisibilityAllAdmins') },
    { value: 'all' as EventVisibility, label: t('eventVisibilityAll') },
  ];

  // --- Field validation ---

  const displayNameError =
    displayNameTouched && displayName.trim() === '' ? t('displayNameRequired') : null;

  const emailError =
    emailTouched
      ? email.trim() === ''
        ? t('emailRequired')
        : !isValidEmail(email.trim())
          ? t('emailInvalid')
          : null
      : null;

  const passwordValidation =
    mode === 'create' || password !== ''
      ? validatePassword(password, {
          required: t('passwordRequired'),
          minLength: (min) => t('passwordMinLength', { count: min }),
          maxLength: (max) => t('passwordMaxLength', { count: max }),
          requirements: t('passwordInsecure'),
        })
      : { valid: true as const };

  const passwordError = passwordTouched ? (passwordValidation.valid ? null : passwordValidation.message) : null;

  const permissionsError =
    isSuperAdmin && permissionsTouched && totalBits(adminsCrudFlags, usersCrudFlags) === 0
      ? t('permissionsRequired')
      : null;

  // --- CRUD change handlers (enforce read dependency) ---

  const handleAdminsCrudChange = (next: CrudFlags) => {
    setAdminsCrudFlags(withReadEnforced(next));
    setPermissionsTouched(true);
  };

  const handleUsersCrudChange = (next: CrudFlags) => {
    setUsersCrudFlags(withReadEnforced(next));
    setPermissionsTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Touch all fields to surface any hidden errors
    setDisplayNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setPermissionsTouched(true);

    // Guard: check validity before submitting
    if (displayName.trim() === '') return;
    if (email.trim() === '' || !isValidEmail(email.trim())) return;
    if (mode === 'create' && !passwordValidation.valid) return;
    if (password !== '' && !passwordValidation.valid) return;
    if (isSuperAdmin && totalBits(adminsCrudFlags, usersCrudFlags) === 0) return;

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
    <FormContainer
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <Stack>
        <Input
          label={t('displayName')}
          value={displayName}
          onChange={setDisplayName}
          onBlur={() => setDisplayNameTouched(true)}
          error={displayNameError}
          autoComplete="off"
        />
        <Input
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => setEmailTouched(true)}
          error={emailError}
          autoComplete="off"
        />
        <Input
          label={mode === 'create' ? t('password') : t('passwordEditHint')}
          type="password"
          value={password}
          onChange={setPassword}
          onBlur={() => setPasswordTouched(true)}
          error={passwordError}
          autoComplete="new-password"
        />
        {(mode === 'create' || password !== '') && (
          <PasswordStrengthMeter password={password} />
        )}

        {isSuperAdmin && (
          <FormSection title={t('permissions')}>
            <CrudCheckboxes
              label={t('adminsCrud')}
              labels={crudLabels}
              flags={adminsCrudFlags}
              onChange={handleAdminsCrudChange}
              disabledBits={computeDisabledBits(adminsCrudFlags)}
              error={permissionsError}
            />
            <CrudCheckboxes
              label={t('usersCrud')}
              labels={crudLabels}
              flags={usersCrudFlags}
              onChange={handleUsersCrudChange}
              disabledBits={computeDisabledBits(usersCrudFlags)}
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
      </Stack>
    </FormContainer>
  );
}
