import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Do not static-import createApp (or any module that imports config). Config reads
// process.env at load time; we must load .env first, then load config/createApp.

const loadEnv = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    const envPath = path.resolve(__dirname, '..', '.env');
    try {
      const dotenv = await import('dotenv');
      dotenv.config({ path: envPath });
    } catch {
      // dotenv optional in dev
    }
  }
};

const run = async (): Promise<void> => {
  await loadEnv();

  const { validateStartupRequirements } = await import('./lib/startup/validation.js');
  validateStartupRequirements();

  const { appDataSource } = await import('@boilerplate/orm');
  await appDataSource.initialize();

  const { config } = await import('./config/index.js');
  const { createApp } = await import('./app.js');
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.warn(`${config.appName} API listening on port ${config.port}`);
  });

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
