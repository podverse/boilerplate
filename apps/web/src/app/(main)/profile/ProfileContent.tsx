'use client';

import { useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { webAuth } from '@boilerplate/helpers-requests';
import {
  CheckboxField,
  ContentPageLayout,
  Divider,
  FormContainer,
  SectionWithHeading,
  Input,
  Button,
  Text,
} from '@boilerplate/ui';

import { useAuth } from '../../../context/AuthContext';
import { getApiBaseUrl } from '../../../lib/api-client';
import type { ServerUser } from '../../../lib/server-auth';

function parseUserFromResponse(data: unknown): {
  id: string;
  email: string;
  displayName: string | null;
  profileVisibility: boolean;
} | null {
  if (data === undefined || typeof data !== 'object' || data === null) return null;
  if (!('user' in data) || typeof (data as { user: unknown }).user !== 'object') return null;
  const u = (
    data as {
      user: {
        id?: string;
        email?: string;
        displayName?: string | null;
        profileVisibility?: boolean;
      };
    }
  ).user;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName ?? null,
    profileVisibility: u.profileVisibility === true,
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
  const [profileVisibility, setProfileVisibility] = useState(u.profileVisibility);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [emailChangeSaving, setEmailChangeSaving] = useState(false);
  const [emailChangeMessage, setEmailChangeMessage] = useState<string | null>(null);

  const handleUpdateProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMessage(null);
      setProfileSaving(true);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await webAuth.updateProfile(baseUrl, {
          displayName: displayName.trim() === '' ? null : displayName.trim(),
          profileVisibility,
        });
        if (res.ok && res.data !== undefined) {
          const updated = parseUserFromResponse(res.data);
          if (updated !== null) {
            setSession(updated);
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
    [displayName, profileVisibility, setSession, t]
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
        const res = await webAuth.changePassword(
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

  const handleRequestEmailChange = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailChangeMessage(null);
      setEmailChangeSaving(true);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await webAuth.requestEmailChange(
          baseUrl,
          { newEmail: newEmail.trim() },
          { locale }
        );
        if (res.ok) {
          setNewEmail('');
          setEmailChangeMessage(t('emailChangeRequested'));
        } else {
          setEmailChangeMessage(res.error?.message ?? t('errors.requestFailed'));
        }
      } catch {
        setEmailChangeMessage(t('errors.requestFailed'));
      } finally {
        setEmailChangeSaving(false);
      }
    },
    [newEmail, locale, t]
  );

  return (
    <ContentPageLayout title={t('title')} type="form">
      <SectionWithHeading title={t('profileInformation')}>
        <FormContainer onSubmit={handleUpdateProfile}>
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
            value={u.email}
            onChange={() => {}}
            disabled
            autoComplete="email"
          />
          <CheckboxField
            label={t('profileVisibility')}
            checked={profileVisibility}
            onChange={setProfileVisibility}
            disabled={profileSaving}
          />
          {profileMessage !== null && (
            <Text size="sm" variant={profileMessage === t('profileUpdated') ? 'success' : 'error'}>
              {profileMessage}
            </Text>
          )}
          <Button type="submit" disabled={profileSaving} loading={profileSaving}>
            {t('updateProfile')}
          </Button>
        </FormContainer>
      </SectionWithHeading>

      <Divider />

      <SectionWithHeading title={t('changePassword')}>
        <FormContainer onSubmit={handleChangePassword}>
          <Input
            label={t('currentPassword')}
            type="password"
            value={currentPassword}
            onChange={(value) => setCurrentPassword(value)}
            placeholder={t('placeholderPassword')}
            disabled={passwordSaving}
            autoComplete="current-password"
          />
          <Input
            label={t('newPassword')}
            type="password"
            value={newPassword}
            onChange={(value) => setNewPassword(value)}
            placeholder={t('placeholderPassword')}
            disabled={passwordSaving}
            autoComplete="new-password"
          />
          <Input
            label={t('confirmNewPassword')}
            type="password"
            value={confirmNewPassword}
            onChange={(value) => setConfirmNewPassword(value)}
            placeholder={t('placeholderPassword')}
            disabled={passwordSaving}
            autoComplete="new-password"
          />
          {passwordMessage !== null && (
            <Text
              size="sm"
              variant={passwordMessage === t('passwordChanged') ? 'success' : 'error'}
            >
              {passwordMessage}
            </Text>
          )}
          <Button type="submit" disabled={passwordSaving} loading={passwordSaving}>
            {t('changePasswordSubmit')}
          </Button>
        </FormContainer>
      </SectionWithHeading>

      <Divider />

      <SectionWithHeading title={t('requestEmailChange')}>
        <FormContainer onSubmit={handleRequestEmailChange}>
          <Input
            label={t('newEmail')}
            type="email"
            value={newEmail}
            onChange={(value) => setNewEmail(value)}
            placeholder="new@example.com"
            disabled={emailChangeSaving}
            autoComplete="email"
          />
          {emailChangeMessage !== null && (
            <Text
              size="sm"
              variant={emailChangeMessage === t('emailChangeRequested') ? 'success' : 'error'}
            >
              {emailChangeMessage}
            </Text>
          )}
          <Button type="submit" disabled={emailChangeSaving} loading={emailChangeSaving}>
            {t('requestEmailChangeSubmit')}
          </Button>
        </FormContainer>
      </SectionWithHeading>
    </ContentPageLayout>
  );
}
