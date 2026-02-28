'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import { ResetPasswordForm, useAuthValidation } from '@boilerplate/ui';
import { webAuth } from '@boilerplate/helpers-requests';
import { getApiBaseUrl } from '../../../lib/api-client';
import { ROUTES } from '../../../lib/routes';

function ResetPasswordContent() {
  const tErrors = useTranslations('errors');
  const tUi = useTranslations('ui');
  const { validatePassword } = useAuthValidation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') ?? '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const tErr = token.trim() === '' ? tErrors('resetTokenRequired') : null;
    const pErr = validatePassword(password);
    const cErr =
      password !== confirmPassword
        ? tErrors('passwordsDoNotMatch')
        : validatePassword(confirmPassword, tUi('auth.resetPassword.confirmPassword'));
    setTokenError(tErr);
    setPasswordError(pErr);
    setConfirmError(cErr);
    if (tErr !== null || pErr !== null || cErr !== null) return;

    setLoading(true);
    const baseUrl = getApiBaseUrl();
    const res = await webAuth.resetPassword(baseUrl, {
      token: token.trim(),
      newPassword: password,
    });
    setLoading(false);

    if (res.ok) {
      router.push(ROUTES.LOGIN);
    } else {
      setSubmitError(res.error?.message ?? tErrors('resetFailed'));
    }
  };

  return (
    <ResetPasswordForm
      token={token}
      password={password}
      confirmPassword={confirmPassword}
      onTokenChange={setToken}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSubmit}
      loading={loading}
      tokenError={tokenError}
      passwordError={passwordError}
      confirmError={confirmError}
      submitError={submitError}
      loginHref={ROUTES.LOGIN}
    />
  );
}

function ResetPasswordFallback() {
  const tCommon = useTranslations('common');
  return <p>{tCommon('loading')}</p>;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
