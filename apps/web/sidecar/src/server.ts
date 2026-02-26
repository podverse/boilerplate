/* eslint-disable no-console */
import http from 'node:http';
import { URL } from 'node:url';

const PORT_KEY = 'PORT';
const APP_NAME_KEY = 'NEXT_PUBLIC_APP_NAME';
const API_URL_KEY = 'NEXT_PUBLIC_API_URL';

/** Startup validation: required env for sidecar. Pattern aligned with API lib/startup/validation. */
function validateStartup(): number {
  const value = process.env[PORT_KEY];
  const isSet =
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '';
  if (!isSet) {
    console.error('[Sidecar] ✗ PORT - Missing (required)');
    throw new Error('FATAL: Missing PORT for runtime config sidecar.');
  }
  const port = Number.parseInt(value, 10);
  if (!Number.isFinite(port) || port <= 0) {
    console.error(`[Sidecar] ✗ PORT - Invalid: "${value}" (must be positive integer)`);
    throw new Error('FATAL: Invalid PORT for runtime config sidecar.');
  }
  console.log(`[Sidecar] ✓ PORT - Set to ${port}`);
  console.log('Sidecar startup validation completed.');
  return port;
}

function buildRuntimeConfig(): { env: Record<string, string | undefined> } {
  return {
    env: {
      [APP_NAME_KEY]: process.env[APP_NAME_KEY] ?? undefined,
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

const port = validateStartup();
server.listen(port, '0.0.0.0', () => {
  console.log(`Boilerplate runtime-config sidecar listening on port ${port}.`);
});
