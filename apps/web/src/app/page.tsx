import { getRuntimeConfig } from '../config/runtime-config-store';

import styles from './page.module.scss';

export default function HomePage() {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'Boilerplate';
  const apiUrl = runtimeConfig.env.NEXT_PUBLIC_API_URL ?? '(not set)';

  return (
    <div className={styles.wrapper}>
      <p className={styles.lead}>Hello from {appName}.</p>
      <p>
        <strong>NEXT_PUBLIC_APP_NAME:</strong> {appName}
      </p>
      <p>
        <strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl}
      </p>
      <p className={styles.meta}>App-specific and shared SCSS in use.</p>
    </div>
  );
}
