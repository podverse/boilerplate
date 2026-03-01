import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { loginSchema } from '../schemas/auth.js';

export function createAuthRouter(requireAuth: RequestHandler): Router {
  const router = Router();
  router.post('/login', loginRateLimiter, validateBody(loginSchema), (req, res) => {
    void authController.login(req, res);
  });
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });
  router.post('/refresh', (req, res) => {
    void authController.refresh(req, res);
  });
  router.get('/me', requireAuth, (req, res) => {
    authController.me(req, res);
  });
  return router;
}
