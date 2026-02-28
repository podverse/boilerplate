/* eslint-disable no-console */
import { validatePositiveInteger, validateStartupRequirements } from '@boilerplate/helpers';
import http from 'node:http';
import { URL } from 'node:url';

const APP_NAME_KEY = 'NEXT_PUBLIC_APP_NAME';
const APP_TITLE_ICON_KEY = 'NEXT_PUBLIC_APP_TITLE_ICON';
const API_URL_KEY = 'NEXT_PUBLIC_API_URL';

validateStartupRequirements([validatePositiveInteger('PORT', 'Sidecar')]);
const port = Number.parseInt(process.env.PORT ?? '', 10);

function buildRuntimeConfig(): { env: Record<string, string | undefined> } {
  return {
    env: {
      [APP_NAME_KEY]: process.env[APP_NAME_KEY] ?? undefined,
      [APP_TITLE_ICON_KEY]: process.env[APP_TITLE_ICON_KEY] ?? undefined,
      [API_URL_KEY]: process.env[API_URL_KEY] ?? undefined,
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

  if (requestUrl.pathname !== '/runtime-config') {
    res.writeHead(404, { 'Cache-Control': 'no-store' });
    res.end('Not Found');
    return;
  }

  const runtimeConfig = buildRuntimeConfig();
  sendJson(res, 200, runtimeConfig);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Boilerplate runtime-config sidecar listening on port ${port}.`);
});
