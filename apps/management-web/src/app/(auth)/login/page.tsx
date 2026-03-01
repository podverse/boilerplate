'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AUTH_MESSAGE_LOGIN_FAILED } from '@boilerplate/helpers';
import { Link, LoginForm } from '@boilerplate/ui';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

export default function LoginPage() {
  const tErrors = useTranslations('errors');
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user !== null) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setSubmitError(
        result.message === AUTH_MESSAGE_LOGIN_FAILED ? tErrors('loginFailed') : result.message
      );
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      loading={loading}
      submitError={submitError}
      signupHref={ROUTES.SIGNUP}
      forgotPasswordHref={ROUTES.FORGOT_PASSWORD}
      LinkComponent={Link}
    />
  );
}
