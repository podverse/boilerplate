'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AUTH_MESSAGE_LOGIN_FAILED } from '@boilerplate/helpers';
import { LoginForm, RateLimitModal } from '@boilerplate/ui';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

export default function LoginPage() {
  const tErrors = useTranslations('errors');
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [rateLimitRetrySeconds, setRateLimitRetrySeconds] = useState<number | undefined>(undefined);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.push(ROUTES.DASHBOARD);
    } else if (result.rateLimit !== undefined) {
      setRateLimitRetrySeconds(result.rateLimit.retryAfterSeconds);
      setShowRateLimitModal(true);
    } else {
      setSubmitError(
        result.message === AUTH_MESSAGE_LOGIN_FAILED ? tErrors('loginFailed') : result.message
      );
    }
  };

  return (
    <>
      <RateLimitModal
        open={showRateLimitModal}
        onClose={() => setShowRateLimitModal(false)}
        retryAfterSeconds={rateLimitRetrySeconds}
      />
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
      />
    </>
  );
}
