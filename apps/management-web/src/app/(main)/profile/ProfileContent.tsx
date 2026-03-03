'use client';

import { useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { managementWebAuth } from '@boilerplate/helpers-requests';
import {
  Card,
  Container,
  Divider,
  FormContainer,
  FormPage,
  Stack,
  Input,
  Button,
  Text,
} from '@boilerplate/ui';

import { useAuth } from '../../../context/AuthContext';
import { getApiBaseUrl } from '../../../lib/api-client';
import type { ServerUser } from '../../../lib/server-auth';

function parseUserFromResponse(
  data: unknown
): { id: string; email: string; displayName: string | null } | null {
  if (data === undefined || typeof data !== 'object' || data === null) return null;
  if (!('user' in data) || typeof (data as { user: unknown }).user !== 'object') return null;
  const u = (data as { user: { id?: string; email?: string; displayName?: string | null } }).user;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName ?? null,
  };
}

export type ProfileContentProps = {
  initialUser: ServerUser;
};

export function ProfileContent({ initialUser }: ProfileContentProps) {
  const t = useTranslations('profile');
  const locale = useLocale();
  const { user, setSession } = useAuth();
  const u = user ?? initialUser;

  const [displayName, setDisplayName] = useState(u.displayName ?? '');
  const [email, setEmail] = useState(u.email);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleUpdateProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMessage(null);
      const trimmed = displayName.trim();
      const emailTrimmed = email.trim();
      if (trimmed === '') {
        setProfileMessage(t('errors.requestFailed'));
        return;
      }
      if (emailTrimmed === '') {
        setProfileMessage(t('errors.requestFailed'));
        return;
      }
      setProfileSaving(true);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await managementWebAuth.updateProfile(baseUrl, {
          displayName: trimmed,
          email: emailTrimmed,
        });
        if (res.ok && res.data !== undefined) {
          const updated = parseUserFromResponse(res.data);
          if (updated !== null) {
            setSession(updated);
            setEmail(updated.email);
            setProfileMessage(t('profileUpdated'));
          }
        } else {
          setProfileMessage(res.error?.message ?? t('errors.requestFailed'));
        }
      } catch {
        setProfileMessage(t('errors.requestFailed'));
      } finally {
        setProfileSaving(false);
      }
    },
    [displayName, email, setSession, t]
  );

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordMessage(null);
      if (newPassword !== confirmNewPassword) {
        setPasswordMessage(t('errors.passwordsDoNotMatch'));
        return;
      }
      setPasswordSaving(true);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await managementWebAuth.changePassword(
          baseUrl,
          { currentPassword, newPassword },
          { locale }
        );
        if (res.ok) {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setPasswordMessage(t('passwordChanged'));
        } else {
          setPasswordMessage(res.error?.message ?? t('errors.requestFailed'));
        }
      } catch {
        setPasswordMessage(t('errors.requestFailed'));
      } finally {
        setPasswordSaving(false);
      }
    },
    [currentPassword, newPassword, confirmNewPassword, locale, t]
  );

  return (
    <Container>
      <FormPage>
        <Stack>
          <Card title={t('title')}>
            <FormContainer onSubmit={handleUpdateProfile}>
              <Stack>
                <Input
                  label={t('displayName')}
                  type="text"
                  value={displayName}
                  onChange={(value) => setDisplayName(value)}
                  placeholder={t('displayNamePlaceholder')}
                  disabled={profileSaving}
                  autoComplete="name"
                />
                <Input
                  label={t('email')}
                  type="email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  placeholder="you@example.com"
                  disabled={profileSaving}
                  autoComplete="email"
                />
                {profileMessage !== null && (
                  <Text
                    size="sm"
                    variant={profileMessage === t('profileUpdated') ? undefined : 'error'}
                  >
                    {profileMessage}
                  </Text>
                )}
                <Button type="submit" disabled={profileSaving} loading={profileSaving}>
                  {t('updateProfile')}
                </Button>
              </Stack>
            </FormContainer>
          </Card>

          <Divider />

          <Card title={t('changePassword')}>
            <FormContainer onSubmit={handleChangePassword}>
              <Stack>
                <Input
                  label={t('currentPassword')}
                  type="password"
                  value={currentPassword}
                  onChange={(value) => setCurrentPassword(value)}
                  placeholder="••••••••"
                  disabled={passwordSaving}
                  autoComplete="current-password"
                />
                <Input
                  label={t('newPassword')}
                  type="password"
                  value={newPassword}
                  onChange={(value) => setNewPassword(value)}
                  placeholder="••••••••"
                  disabled={passwordSaving}
                  autoComplete="new-password"
                />
                <Input
                  label={t('confirmNewPassword')}
                  type="password"
                  value={confirmNewPassword}
                  onChange={(value) => setConfirmNewPassword(value)}
                  placeholder="••••••••"
                  disabled={passwordSaving}
                  autoComplete="new-password"
                />
                {passwordMessage !== null && (
                  <Text
                    size="sm"
                    variant={passwordMessage === t('passwordChanged') ? undefined : 'error'}
                  >
                    {passwordMessage}
                  </Text>
                )}
                <Button type="submit" disabled={passwordSaving} loading={passwordSaving}>
                  {t('changePasswordSubmit')}
                </Button>
              </Stack>
            </FormContainer>
          </Card>
        </Stack>
      </FormPage>
    </Container>
  );
}
