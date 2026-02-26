import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { openApiDocument } from './openapi.js';

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

  const { config, isNoMailerMode } = await import('./config/index.js');

  const { requireAuth } = await import('./middleware/requireAuth.js');
  const { createAuthRouter } = await import('./routes/auth.js');

  const authMiddleware = requireAuth(config.jwtSecret);
  const mountSignup = !isNoMailerMode();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const openApiDoc = {
    ...openApiDocument,
    servers: [{ url: config.apiVersionPath, description: `API ${config.apiVersionPath}` }],
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

  const v1Router = express.Router();
  v1Router.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok', app: config.appName });
  });
  v1Router.get('/', (_req: Request, res: Response): void => {
    res.json({
      message: `Hello from ${config.appName}`,
      env: { port: config.port },
    });
  });
  v1Router.use('/auth', createAuthRouter(authMiddleware, mountSignup));

  app.use(config.apiVersionPath, v1Router);

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
