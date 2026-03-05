'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { validatePassword } from '@boilerplate/helpers';
import { managementWebUsers } from '@boilerplate/helpers-requests';
import type { CreateUserBody } from '@boilerplate/helpers-requests';
import {
  Button,
  FormActions,
  FormContainer,
  FormSection,
  Input,
  PasswordStrengthMeter,
  Stack,
  Text,
} from '@boilerplate/ui';

import { getManagementApiBaseUrl } from '../../config/env';
import { ROUTES } from '../../lib/routes';

export type UserFormInitialValues = {
  email: string;
  displayName: string;
};

export type UserFormProps = {
  mode: 'create' | 'edit';
  userId?: string;
  initialValues?: UserFormInitialValues;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function UserForm({ mode, userId, initialValues }: UserFormProps) {
  const router = useRouter();
  const t = useTranslations('common.userForm');
  const apiBaseUrl = getManagementApiBaseUrl();

  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? '');

  const [newPassword, setNewPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const passwordValidation =
    mode === 'create' || password !== ''
      ? validatePassword(password, {
          required: t('passwordRequired'),
          minLength: (min) => t('passwordMinLength', { count: min }),
          maxLength: (max) => t('passwordMaxLength', { count: max }),
          requirements: t('passwordInsecure'),
        })
      : { valid: true as const };

  const newPasswordValidation =
    newPassword !== ''
      ? validatePassword(newPassword, {
          required: t('passwordRequired'),
          minLength: (min) => t('passwordMinLength', { count: min }),
          maxLength: (max) => t('passwordMaxLength', { count: max }),
          requirements: t('passwordInsecure'),
        })
      : { valid: true as const };

  const emailError = emailTouched
    ? email.trim() === ''
      ? t('emailRequired')
      : !isValidEmail(email.trim())
        ? t('emailInvalid')
        : null
    : null;

  const passwordError =
    passwordTouched && mode === 'create'
      ? passwordValidation.valid
        ? null
        : passwordValidation.message
      : null;

  const newPasswordError =
    newPasswordTouched && newPassword !== ''
      ? newPasswordValidation.valid
        ? null
        : newPasswordValidation.message
      : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (email.trim() === '' || !isValidEmail(email.trim())) return;
    if (mode === 'create') {
      if (!passwordValidation.valid) return;
      setSubmitError(null);
      setLoading(true);
      try {
        const body: CreateUserBody = {
          email: email.trim(),
          password,
          displayName: displayName.trim() === '' ? null : displayName.trim(),
        };
        const res = await managementWebUsers.createUser(apiBaseUrl, body);
        if (!res.ok) {
          setSubmitError(res.error.message ?? t('createFailed'));
          return;
        }
        router.push(ROUTES.USERS);
        router.refresh();
      } finally {
        setLoading(false);
      }
    } else {
      if (userId === undefined) return;
      setSubmitError(null);
      setLoading(true);
      try {
        const res = await managementWebUsers.updateUser(apiBaseUrl, userId, {
          email: email.trim(),
          displayName: displayName.trim() === '' ? null : displayName.trim(),
        });
        if (!res.ok) {
          setSubmitError(res.error.message ?? t('updateFailed'));
          return;
        }
        router.push(ROUTES.USERS);
        router.refresh();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNewPasswordTouched(true);
    if (newPassword === '' || !newPasswordValidation.valid || userId === undefined) return;
    setChangePasswordError(null);
    setChangePasswordLoading(true);
    try {
      const res = await managementWebUsers.changeUserPassword(apiBaseUrl, userId, {
        newPassword,
      });
      if (!res.ok) {
        setChangePasswordError(res.error.message ?? t('changePasswordFailed'));
        return;
      }
      setNewPassword('');
      setNewPasswordTouched(false);
      setChangePasswordError(null);
    } finally {
      setChangePasswordLoading(false);
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
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => setEmailTouched(true)}
          error={emailError}
          autoComplete="off"
        />
        {mode === 'create' && (
          <>
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={setPassword}
              onBlur={() => setPasswordTouched(true)}
              error={passwordError}
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} />
          </>
        )}
        <Input
          label={t('displayNameOptional')}
          value={displayName}
          onChange={setDisplayName}
          autoComplete="off"
        />

        {submitError !== null && (
          <Text variant="error" role="alert">
            {submitError}
          </Text>
        )}

        <FormActions>
          <Button type="submit" variant="primary" loading={loading}>
            {mode === 'create' ? t('createUser') : t('saveChanges')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(ROUTES.USERS)}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
        </FormActions>

        {mode === 'edit' && userId !== undefined && (
          <FormSection title={t('changePassword')}>
            <Input
              label={t('newPassword')}
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              onBlur={() => setNewPasswordTouched(true)}
              error={newPasswordError}
              autoComplete="new-password"
            />
            {newPassword !== '' && <PasswordStrengthMeter password={newPassword} />}
            {changePasswordError !== null && (
              <Text variant="error" role="alert">
                {changePasswordError}
              </Text>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleChangePassword}
              loading={changePasswordLoading}
              disabled={newPassword === '' || !newPasswordValidation.valid}
            >
              {t('changePasswordButton')}
            </Button>
          </FormSection>
        )}
      </Stack>
    </FormContainer>
  );
}
