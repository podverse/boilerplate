import { getRuntimeConfig } from '../config/runtime-config-store';

export default function HomePage() {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'Boilerplate';
  const apiUrl = runtimeConfig.env.NEXT_PUBLIC_API_URL ?? '(not set)';

  return (
    <div>
      <p>Hello from {appName}.</p>
      <p>
        <strong>NEXT_PUBLIC_APP_NAME:</strong> {appName}
      </p>
      <p>
        <strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl}
      </p>
    </div>
  );
}
