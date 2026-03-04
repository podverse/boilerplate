/**
 * Express app factory. Builds the app without calling listen() so it can be used
 * by the server (index.ts) and by integration tests (supertest).
 */
import type { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { config, isNoMailerMode } from './config/index.js';
import { requireAuth } from './middleware/requireAuth.js';
import { openApiDocument } from './openapi.js';
import { createAuthRouter } from './routes/auth.js';
import { createBucketAdminInvitationsRouter } from './routes/bucketAdminInvitations.js';
import { createBucketsRouter } from './routes/buckets.js';

export function createApp(): Application {
  const app = express();
  const corsOptions: { origin: string[] | boolean; credentials: boolean } = {
    origin: config.corsOrigins ?? true,
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());

  const openApiDoc = {
    ...openApiDocument,
    servers: [{ url: config.apiVersionPath, description: `API ${config.apiVersionPath}` }],
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

  const authMiddleware = requireAuth({
    jwtSecret: config.jwtSecret,
    sessionCookieName: config.sessionCookieName,
  });
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
  versionedRouter.use('/buckets', createBucketsRouter(authMiddleware));
  versionedRouter.use('/admin-invitations', createBucketAdminInvitationsRouter(authMiddleware));

  app.use(config.apiVersionPath, versionedRouter);

  return app;
}
