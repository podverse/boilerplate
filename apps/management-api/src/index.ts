import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadEnv = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dotenv = await import('dotenv');
      const envPath = path.resolve(__dirname, '..', '.env');
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

  const { managementDataSource } = await import('@boilerplate/management-orm');
  await managementDataSource.initialize();

  const { config } = await import('./config/index.js');
  const app = (await import('./app.js')).createApp();
  const server = app.listen(config.port, () => {
    console.warn(`${config.appName} listening on port ${config.port}`);
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
