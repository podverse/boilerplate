/**
 * Express app factory. Builds the app without calling listen() so it can be used
 * by the server (index.ts) and by integration tests (supertest).
 */
import type { Application } from 'express';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { config, isNoMailerMode } from './config/index.js';
import { requireAuth } from './middleware/requireAuth.js';
import { openApiDocument } from './openapi.js';
import { createAuthRouter } from './routes/auth.js';

export function createApp(): Application {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const openApiDoc = {
    ...openApiDocument,
    servers: [{ url: config.apiVersionPath, description: `API ${config.apiVersionPath}` }],
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

  const authMiddleware = requireAuth(config.jwtSecret);
  const mountSignup = !isNoMailerMode();

  const versionedRouter = express.Router();
  versionedRouter.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok', app: config.appName });
  });
  versionedRouter.get('/', (_req: Request, res: Response): void => {
    res.json({
      message: `Hello from ${config.appName}`,
      env: { port: config.port },
    });
  });
  versionedRouter.use('/auth', createAuthRouter(authMiddleware, mountSignup));

  app.use(config.apiVersionPath, versionedRouter);

  return app;
}
