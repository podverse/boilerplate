import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { isMailerEnabled } from '../lib/mailer/send.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  loginSchema,
  signupSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  requestEmailChangeSchema,
} from '../schemas/auth.js';

export function createAuthRouter(
  requireAuthMiddleware: RequestHandler,
  mountSignup: boolean
): Router {
  const router = Router();

  router.post('/login', validateBody(loginSchema), (req, res) => {
    void authController.login(req, res);
  });
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });
  router.post('/refresh', (req, res) => {
    void authController.refresh(req, res);
  });
  router.post(
    '/change-password',
    requireAuthMiddleware,
    validateBody(changePasswordSchema),
    (req, res) => {
      void authController.changePassword(req, res);
    }
  );
  router.get('/me', requireAuthMiddleware, (req, res) => {
    authController.me(req, res);
  });

  if (mountSignup) {
    router.post('/signup', validateBody(signupSchema), (req, res) => {
      void authController.signup(req, res);
    });
  } else {
    router.post('/signup', (_req, res) => {
      res.status(403).json({ message: 'Registration is by admin only' });
    });
  }

  // Plan 34: verification flows (mailer mode only)
  router.post('/verify-email', (req, res) => {
    if (!isMailerEnabled()) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.verifyEmail(req, res);
  });
  router.post('/forgot-password', validateBody(forgotPasswordSchema), (req, res) => {
    if (!isMailerEnabled()) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.forgotPassword(req, res);
  });
  router.post('/reset-password', validateBody(resetPasswordSchema), (req, res) => {
    if (!isMailerEnabled()) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.resetPassword(req, res);
  });
  router.post(
    '/request-email-change',
    requireAuthMiddleware,
    validateBody(requestEmailChangeSchema),
    (req, res) => {
      if (!isMailerEnabled()) {
        res.status(403).json({ message: 'Email verification is not enabled' });
        return;
      }
      void authController.requestEmailChange(req, res);
    }
  );
  router.post('/confirm-email-change', (req, res) => {
    if (!isMailerEnabled()) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.confirmEmailChange(req, res);
  });

  return router;
}
