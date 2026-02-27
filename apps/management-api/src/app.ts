/**
 * Express app factory for management API. Used by server (index.ts) and integration tests.
 */
import type { Application } from 'express';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/index.js';
import { requireManagementAuth } from './middleware/requireManagementAuth.js';
import { requireSuperAdmin } from './middleware/requireSuperAdmin.js';
import { openApiDocument } from './openapi.js';
import { createAdminsRouter } from './routes/admins.js';
import { createAuthRouter } from './routes/auth.js';
import { createEventsRouter } from './routes/events.js';
import { createUsersRouter } from './routes/users.js';

export function createApp(): Application {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const openApiDoc = {
    ...openApiDocument,
    servers: [{ url: config.apiVersionPath, description: `API ${config.apiVersionPath}` }],
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

  const requireAuth = requireManagementAuth(config.jwtSecret);
  const requireSuperAdminMiddleware = requireSuperAdmin;

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
  versionedRouter.use('/auth', createAuthRouter(requireAuth));
  versionedRouter.use('/admins', createAdminsRouter(requireAuth, requireSuperAdminMiddleware));
  versionedRouter.use('/users', createUsersRouter(requireAuth));
  versionedRouter.use('/events', createEventsRouter(requireAuth));

  app.use(config.apiVersionPath, versionedRouter);

  return app;
}
