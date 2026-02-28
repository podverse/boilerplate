'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Form, FormLinks } from '../../Form';
import type { FormLinkComponent } from '../../Form';

export type LoginFormProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  loading: boolean;
  emailError?: string | null;
  passwordError?: string | null;
  submitError?: string | null;
  signupHref: string;
  forgotPasswordHref: string;
  /** Optional override for the link component used in form links (defaults to Next.js Link). */
  LinkComponent?: FormLinkComponent;
};

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  emailError,
  passwordError,
  submitError,
  signupHref,
  forgotPasswordHref,
  LinkComponent,
}: LoginFormProps) {
  const t = useTranslations('ui.auth.login');
  return (
    <Form title={t('title')} submitError={submitError} onSubmit={onSubmit}>
      <Input
        label={t('email')}
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder={t('placeholderEmail')}
        error={emailError}
        autoComplete="email"
        disabled={loading}
      />
      <Input
        label={t('password')}
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder={t('placeholderPassword')}
        error={passwordError}
        autoComplete="current-password"
        disabled={loading}
      />
      <Button type="submit" variant="primary" loading={loading}>
        {t('submit')}
      </Button>
      <FormLinks
        {...(LinkComponent !== undefined && { LinkComponent })}
        items={[
          { href: signupHref, children: t('signUp') },
          { href: forgotPasswordHref, children: t('forgotPassword') },
        ]}
      />
    </Form>
  );
}
