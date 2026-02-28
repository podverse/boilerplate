// Shared UI components and exports. Styles live under src/styles/ and are
// consumed via package exports (@boilerplate/ui/styles, etc.).

export { Form, FormLinks, SubmitError } from './components/Form';
export type {
  FormLinkComponent,
  FormLinkComponentProps,
  FormLinkItem,
  FormLinksProps,
  FormProps,
  SubmitErrorProps,
} from './components/Form';
export {
  ForgotPasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignupForm,
} from './components/AuthForms';
export type {
  ForgotPasswordFormProps,
  LoginFormProps,
  ResetPasswordFormProps,
  SignupFormProps,
} from './components/AuthForms';
export { AppHeader } from './components/AppHeader';
export type {
  AppHeaderLinkComponentProps,
  AppHeaderProps,
  AppHeaderUser,
} from './components/AppHeader';
export { Link } from './components/Link';
export type { LinkProps } from './components/Link';
export type { DropdownLinkComponentProps } from './components/Dropdown';
export { AppView } from './components/AppView';
export type { AppViewProps } from './components/AppView';
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
export { CenterInViewport } from './components/CenterInViewport';
export type { CenterInViewportProps } from './components/CenterInViewport';
export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';
export { Dropdown } from './components/Dropdown';
export type { DropdownProps, DropdownItem } from './components/Dropdown';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
export type { PasswordStrengthMeterProps } from './components/PasswordStrengthMeter';
export { List } from './components/List';
export type { ListProps } from './components/List';
export { Row } from './components/Row';
export type { RowProps } from './components/Row';
export { Stack } from './components/Stack';
export type { StackProps } from './components/Stack';
export { Text } from './components/Text';
export type { TextProps, TextSize, TextVariant } from './components/Text';
export { getSettingsFromCookieValue, getThemeFromSettingsCookieValue, THEMES } from './lib/settingsCookie';
export type { Theme } from './lib/settingsCookie';
export { getSettingsCookieValue, setSettingsCookie } from './lib/settingsCookieClient';
export type { SetSettingsCookieOptions } from './lib/settingsCookieClient';
export { useAuthValidation } from './hooks/useAuthValidation';
export type { AuthValidationTranslations } from './lib/validation';
export { validateEmailWithT, validatePasswordWithT } from './lib/validation';
export { ThemeProvider, ThemeWrapper, useTheme } from './contexts/ThemeContext';
export type { ThemeContextValue, ThemeWrapperProps } from './contexts/ThemeContext';
export { ThemeSelector } from './components/ThemeSelector';
