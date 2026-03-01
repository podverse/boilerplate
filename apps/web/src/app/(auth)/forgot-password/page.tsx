'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ForgotPasswordForm, useAuthValidation } from '@boilerplate/ui';
import { webAuth } from '@boilerplate/helpers-requests';
import { getApiBaseUrl } from '../../../lib/api-client';
import { ROUTES } from '../../../lib/routes';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const tErrors = useTranslations('errors');
  const { validateEmail } = useAuthValidation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr !== null) return;

    setLoading(true);
    const baseUrl = getApiBaseUrl();
    const res = await webAuth.forgotPassword(baseUrl, email, { locale });
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      setSubmitError(res.error?.message ?? tErrors('requestFailed'));
    }
  };

  return (
    <ForgotPasswordForm
      email={email}
      onEmailChange={setEmail}
      onSubmit={handleSubmit}
      loading={loading}
      emailError={emailError}
      submitError={submitError}
      success={success}
      loginHref={ROUTES.LOGIN}
    />
  );
}
