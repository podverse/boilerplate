/**
 * Renders the app-type title: app name plus an optional icon (e.g. Font Awesome).
 * Icon class is typically provided via NEXT_PUBLIC_APP_TITLE_ICON.
 */
export function AppTypeTitle({
  appName,
  titleIcon,
}: {
  appName: string;
  titleIcon?: string | null;
}) {
  const iconClass = titleIcon?.trim();
  return (
    <>
      {appName}
      {iconClass !== undefined && iconClass !== '' ? (
        <i className={iconClass} aria-hidden />
      ) : null}
    </>
  );
}
