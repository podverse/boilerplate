/* eslint-disable no-console */
import http from 'node:http';
import { URL } from 'node:url';

import { validatePositiveInteger, validateStartupRequirements } from '@boilerplate/helpers';

const PORT_KEY = 'PORT';
const MGMT_API_URL_KEY = 'NEXT_PUBLIC_MANAGEMENT_API_URL';
const MGMT_API_VERSION_PATH_KEY = 'NEXT_PUBLIC_MANAGEMENT_API_VERSION_PATH';
const SESSION_REFRESH_KEY = 'NEXT_PUBLIC_MANAGEMENT_SESSION_REFRESH_INTERVAL_MS';
const BRAND_NAME_KEY = 'NEXT_PUBLIC_BRAND_NAME';
const APP_TITLE_ICON_KEY = 'NEXT_PUBLIC_APP_TITLE_ICON';
const WEB_APP_URL_KEY = 'NEXT_PUBLIC_WEB_APP_URL';
const DEFAULT_LOCALE_KEY = 'NEXT_PUBLIC_DEFAULT_LOCALE';
const SUPPORTED_LOCALES_KEY = 'NEXT_PUBLIC_SUPPORTED_LOCALES';
const MANAGEMENT_API_BACKEND_URL_KEY = 'MANAGEMENT_API_BACKEND_URL';

validateStartupRequirements([validatePositiveInteger(PORT_KEY, 'Management-web sidecar')]);
const port = Number.parseInt(process.env[PORT_KEY] ?? '', 10);

function buildRuntimeConfig(): { env: Record<string, string | undefined> } {
  return {
    env: {
      [MGMT_API_URL_KEY]: process.env[MGMT_API_URL_KEY] ?? undefined,
      [MGMT_API_VERSION_PATH_KEY]: process.env[MGMT_API_VERSION_PATH_KEY] ?? undefined,
      [SESSION_REFRESH_KEY]: process.env[SESSION_REFRESH_KEY] ?? undefined,
      [BRAND_NAME_KEY]: process.env[BRAND_NAME_KEY] ?? undefined,
      [APP_TITLE_ICON_KEY]: process.env[APP_TITLE_ICON_KEY] ?? undefined,
      [WEB_APP_URL_KEY]: process.env[WEB_APP_URL_KEY] ?? undefined,
      [DEFAULT_LOCALE_KEY]: process.env[DEFAULT_LOCALE_KEY] ?? undefined,
      [SUPPORTED_LOCALES_KEY]: process.env[SUPPORTED_LOCALES_KEY] ?? undefined,
      [MANAGEMENT_API_BACKEND_URL_KEY]: process.env[MANAGEMENT_API_BACKEND_URL_KEY] ?? undefined,
    },
  };
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Cache-Control': 'no-store' });
    res.end('Method Not Allowed');
    return;
  }

  if (requestUrl.pathname === '/' || requestUrl.pathname === '') {
    sendJson(res, 200, {
      status: 'ok',
      message: 'Management-web runtime-config sidecar is online',
    });
    return;
  }

  if (requestUrl.pathname !== '/runtime-config') {
    res.writeHead(404, { 'Cache-Control': 'no-store' });
    res.end('Not Found');
    return;
  }

  const runtimeConfig = buildRuntimeConfig();
  sendJson(res, 200, runtimeConfig);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Boilerplate management-web runtime-config sidecar listening on port ${port}.`);
});

const onSignal = (): void => {
  server.close(() => process.exit(0));
};
process.on('SIGINT', onSignal);
process.on('SIGTERM', onSignal);
