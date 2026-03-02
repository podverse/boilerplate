/**
 * Renders the app-type title: app name plus an optional icon (e.g. Font Awesome).
 * Icon class is typically provided via NEXT_PUBLIC_APP_TITLE_ICON.
 * A space is rendered between the name and icon only when an icon is present.
 */
export function AppTypeTitle({
  appName,
  titleIcon,
}: {
  appName: string;
  titleIcon?: string | null;
}) {
  const iconClass = titleIcon?.trim();
  const hasIcon = iconClass !== undefined && iconClass !== '';
  return (
    <>
      {appName}
      {hasIcon ? (
        <>
          {' '}
          <i className={iconClass} aria-hidden />
        </>
      ) : null}
    </>
  );
}
