'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SignupForm, useAuthValidation } from '@boilerplate/ui';
import { webAuth } from '@boilerplate/helpers-requests';
import { useAuth } from '../../../context/AuthContext';
import { getApiBaseUrl } from '../../../lib/api-client';
import { ROUTES } from '../../../lib/routes';

export default function SignupPage() {
  const tErrors = useTranslations('errors');
  const tUi = useTranslations('ui');
  const { validateEmail, validatePassword } = useAuthValidation();
  const { setSession } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr =
      password !== confirmPassword
        ? tErrors('passwordsDoNotMatch')
        : validatePassword(confirmPassword, tUi('auth.signup.confirmPassword'));
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);
    if (eErr !== null || pErr !== null || cErr !== null) return;

    setLoading(true);
    const baseUrl = getApiBaseUrl();
    const res = await webAuth.signup(baseUrl, {
      email,
      password,
      displayName: displayName.trim() || undefined,
    });
    setLoading(false);

    if (
      res.ok &&
      res.data !== undefined &&
      typeof res.data === 'object' &&
      res.data !== null &&
      'user' in res.data
    ) {
      const data = res.data as {
        user: { id: string; email: string; displayName: string | null };
      };
      setSession({
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName ?? null,
      });
      router.push(ROUTES.DASHBOARD);
    } else if (res.ok) {
      router.push(ROUTES.LOGIN);
    } else {
      setSubmitError(res.error?.message ?? tErrors('signupFailed'));
    }
  };

  return (
    <SignupForm
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      displayName={displayName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onDisplayNameChange={setDisplayName}
      onSubmit={handleSubmit}
      loading={loading}
      emailError={emailError}
      passwordError={passwordError}
      confirmError={confirmError}
      submitError={submitError}
      loginHref={ROUTES.LOGIN}
    />
  );
}
