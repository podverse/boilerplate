'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../../Button';
import { Card } from '../../Card';
import { Input } from '../../Input';
import { Form, FormLinks } from '../../Form';
import type { FormLinkComponent } from '../../Form';

export type ForgotPasswordFormProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  loading: boolean;
  emailError?: string | null;
  submitError?: string | null;
  success: boolean;
  loginHref: string;
  /** Optional override for the link component used in form links (defaults to Next.js Link). */
  LinkComponent?: FormLinkComponent;
};

export function ForgotPasswordForm({
  email,
  onEmailChange,
  onSubmit,
  loading,
  emailError,
  submitError,
  success,
  loginHref,
  LinkComponent,
}: ForgotPasswordFormProps) {
  const t = useTranslations('ui.auth.forgotPassword');
  if (success) {
    return (
      <Card title={t('successTitle')}>
        <p>{t('successMessage')}</p>
        <FormLinks
          {...(LinkComponent !== undefined && { LinkComponent })}
          items={[{ href: loginHref, children: t('backToLogin') }]}
        />
      </Card>
    );
  }

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
      <Button type="submit" variant="primary" loading={loading}>
        {t('submit')}
      </Button>
      <FormLinks
        {...(LinkComponent !== undefined && { LinkComponent })}
        items={[{ href: loginHref, children: t('backToLogin') }]}
      />
    </Form>
  );
}
