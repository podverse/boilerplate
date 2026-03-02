// Shared UI components and exports. Styles live under src/styles/ and are
// consumed via package exports (@boilerplate/ui/styles, etc.).

export { Form, FormLinks, SubmitError } from './components/form/Form';
export type {
  FormLinkComponent,
  FormLinkComponentProps,
  FormLinkItem,
  FormLinksProps,
  FormProps,
  SubmitErrorProps,
} from './components/form/Form';
export {
  ForgotPasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignupForm,
} from './components/form/AuthForms';
export type {
  ForgotPasswordFormProps,
  LoginFormProps,
  ResetPasswordFormProps,
  SignupFormProps,
} from './components/form/AuthForms';
export { AppHeader } from './components/navigation/AppHeader';
export type {
  AppHeaderLinkComponentProps,
  AppHeaderProps,
  AppHeaderUser,
} from './components/navigation/AppHeader';
export { AppTypeTitle } from './components/navigation/AppTypeTitle';
export { Link } from './components/navigation/Link';
export type { LinkProps } from './components/navigation/Link';
export type { DropdownLinkComponentProps } from './components/navigation/Dropdown';
export { AppView } from './components/layout/AppView';
export type { AppViewProps } from './components/layout/AppView';
export { Main } from './components/layout/Main';
export type { MainProps } from './components/layout/Main';
export { Button } from './components/form/Button';
export type { ButtonProps, ButtonVariant } from './components/form/Button';
export { Card } from './components/layout/Card';
export type { CardProps } from './components/layout/Card';
export { CenterInViewport } from './components/layout/CenterInViewport';
export type { CenterInViewportProps } from './components/layout/CenterInViewport';
export { Container } from './components/layout/Container';
export type { ContainerProps } from './components/layout/Container';
export { PageHeader } from './components/layout/PageHeader';
export type { PageHeaderProps } from './components/layout/PageHeader';
export { Dropdown } from './components/navigation/Dropdown';
export type { DropdownProps, DropdownItem } from './components/navigation/Dropdown';
export { Input } from './components/form/Input';
export type { InputProps } from './components/form/Input';
export { Select } from './components/form/Select';
export type { SelectOption, SelectProps } from './components/form/Select';
export { PasswordStrengthMeter } from './components/form/PasswordStrengthMeter';
export type { PasswordStrengthMeterProps } from './components/form/PasswordStrengthMeter';
export { List } from './components/layout/List';
export type { ListProps } from './components/layout/List';
export { Row } from './components/layout/Row';
export type { RowProps } from './components/layout/Row';
export { Stack } from './components/layout/Stack';
export type { StackProps } from './components/layout/Stack';
export { Text } from './components/layout/Text';
export type { TextProps, TextSize, TextVariant } from './components/layout/Text';
export {
  getLocaleFromSettingsCookieValue,
  getSettingsFromCookieValue,
  getThemeFromSettingsCookieValue,
  THEMES,
} from './lib/settingsCookie';
export type { Theme } from './lib/settingsCookie';
export { getSettingsCookieValue, setSettingsCookie } from './lib/settingsCookieClient';
export type { SetSettingsCookieOptions } from './lib/settingsCookieClient';
export { useAuthValidation } from './hooks/useAuthValidation';
export type { AuthValidationTranslations } from './lib/validation';
export { validateEmailWithT, validatePasswordWithT } from './lib/validation';
export { ThemeProvider, ThemeWrapper, useTheme } from './contexts/ThemeContext';
export type { ThemeContextValue, ThemeWrapperProps } from './contexts/ThemeContext';
export { ThemeSelector } from './components/navigation/ThemeSelector';
export { Tabs } from './components/navigation/Tabs';
export type { TabItem, TabsLinkComponentProps, TabsProps } from './components/navigation/Tabs';
export { LoadingSpinner } from './components/feedback/LoadingSpinner';
export type { LoadingSpinnerProps } from './components/feedback/LoadingSpinner';
export { Modal, NavigationLoadingOverlay, RateLimitModal } from './components/modal/Modal';
export type { ModalProps, RateLimitModalProps } from './components/modal/Modal';
export { Table } from './components/table/Table';
export type {
  TableProps,
  TableScrollContainerProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderCellProps,
  TableCellProps,
} from './components/table/Table';
export { TableFilterBar } from './components/table/TableFilterBar';
export type { TableFilterBarColumn, TableFilterBarProps } from './components/table/TableFilterBar';
export { TableWithFilter } from './components/table/TableWithFilter';
export type { FilterableTableRow, TableWithFilterProps } from './components/table/TableWithFilter';
export { Pagination, GoToPageModal } from './components/navigation/Pagination';
export type { PaginationProps, GoToPageModalProps } from './components/navigation/Pagination';
export { NavigationProvider, useNavigationContext } from './contexts/NavigationContext';
export { CheckboxField } from './components/form/CheckboxField';
export type { CheckboxFieldProps } from './components/form/CheckboxField';
export { CrudCheckboxes } from './components/form/CrudCheckboxes';
export type { CrudCheckboxesProps, CrudFlags } from './components/form/CrudCheckboxes';
export { FormActions } from './components/form/FormActions';
export type { FormActionsProps } from './components/form/FormActions';
export { FormSection } from './components/form/FormSection';
export type { FormSectionProps } from './components/form/FormSection';
