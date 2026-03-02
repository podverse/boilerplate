import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SignupForm } from './SignupForm';

const meta: Meta<typeof SignupForm> = {
  component: SignupForm,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    emailError: { control: 'text' },
    passwordError: { control: 'text' },
    confirmError: { control: 'text' },
    submitError: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SignupForm>;

function SignupFormWrapper(props: React.ComponentProps<typeof SignupForm>) {
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);
  const [confirmPassword, setConfirmPassword] = useState(props.confirmPassword);
  const [displayName, setDisplayName] = useState(props.displayName);
  return (
    <SignupForm
      {...props}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      displayName={displayName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onDisplayNameChange={setDisplayName}
      onSubmit={(e) => e.preventDefault()}
    />
  );
}

export const Default: Story = {
  render: (args) => (
    <SignupFormWrapper
      {...args}
      email=""
      password=""
      confirmPassword=""
      displayName=""
      loginHref="#login"
    />
  ),
  args: {
    loading: false,
  },
};

export const WithErrors: Story = {
  render: (args) => (
    <SignupFormWrapper
      {...args}
      email="bad@"
      password="short"
      confirmPassword="different"
      displayName=""
      loginHref="#login"
    />
  ),
  args: {
    loading: false,
    emailError: 'Invalid email',
    passwordError: 'Password too short',
    confirmError: 'Passwords do not match',
    submitError: 'Sign up failed.',
  },
};

export const Loading: Story = {
  render: (args) => (
    <SignupFormWrapper
      {...args}
      email="user@example.com"
      password="••••••••"
      confirmPassword="••••••••"
      displayName="Jane"
      loginHref="#login"
    />
  ),
  args: {
    loading: true,
  },
};
