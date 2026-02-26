import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as authController from '../controllers/authController.js';

export function createAuthRouter(requireAuthMiddleware: RequestHandler, mountSignup: boolean): Router {
  const router = Router();

  router.post('/login', (req, res) => {
    void authController.login(req, res);
  });
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });
  router.post('/change-password', requireAuthMiddleware, (req, res) => {
    void authController.changePassword(req, res);
  });
  router.get('/me', requireAuthMiddleware, (req, res) => {
    authController.me(req, res);
  });

  if (mountSignup) {
    router.post('/signup', (req, res) => {
      void authController.signup(req, res);
    });
  } else {
    router.post('/signup', (_req, res) => {
      res.status(403).json({ message: 'Registration is by admin only' });
    });
  }

  return router;
}
